<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = Order::query()
            ->with(['customer:id,phone,email'])
            ->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('phone', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->get()->map(fn($o) => [
            'id' => $o->id,
            'invoice_number' => $o->invoice_number,
            'status' => $o->status,
            'total_amount' => (float) $o->total_amount,
            'payment_proof' => $o->payment_proof,
            'created_at' => $o->created_at->format('d M Y H:i'),
            'customer' => [
                'phone' => $o->customer->phone,
                'email' => $o->customer->email,
            ],
        ]);

        $stats = [
            'all' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'paid' => Order::where('status', 'paid')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'expired' => Order::where('status', 'expired')->count(),
            'failed' => Order::where('status', 'failed')->count(),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['customer', 'items.product', 'verifiedBy:id,name']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'invoice_number' => $order->invoice_number,
                'status' => $order->status,
                'total_amount' => (float) $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_proof' => $order->payment_proof,
                'payment_verified_at' => $order->payment_verified_at?->format('d M Y H:i'),
                'paid_at' => $order->paid_at?->format('d M Y H:i'),
                'delivered_at' => $order->delivered_at?->format('d M Y H:i'),
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('d M Y H:i'),
                'verified_by' => $order->verifiedBy?->name,
                'customer' => [
                    'id' => $order->customer->id,
                    'name' => $order->customer->name,
                    'phone' => $order->customer->phone,
                    'email' => $order->customer->email,
                ],
                'items' => $order->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_name' => $item->variant_name,
                    'delivery_content' => $item->delivery_content,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ],
        ]);
    }

    public function deliver(Order $order)
    {
        if ($order->status !== 'paid') {
            return back()->withErrors(['status' => 'Order belum dibayar.']);
        }

        $order->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        return back()->with('success', 'Produk berhasil ditandai terkirim.');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,expired,failed,delivered',
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        if ($oldStatus !== $newStatus) {
            // Restore stock jika beralih dari pending ke expired/failed
            if ($oldStatus === 'pending' && in_array($newStatus, ['expired', 'failed'])) {
                $order->load('items');
                foreach ($order->items as $item) {
                    if ($item->product_variant_id) {
                        \App\Models\ProductVariant::where('id', $item->product_variant_id)
                            ->increment('stock', $item->quantity);
                    }
                }
            } elseif (in_array($oldStatus, ['expired', 'failed']) && in_array($newStatus, ['pending', 'paid', 'delivered'])) {
                // Potong stock kembali jika diaktifkan ulang
                $order->load('items');
                foreach ($order->items as $item) {
                    if ($item->product_variant_id) {
                        \App\Models\ProductVariant::where('id', $item->product_variant_id)
                            ->decrement('stock', $item->quantity);
                    }
                }
            }

            $updates = ['status' => $newStatus];
            if ($newStatus === 'paid' && !$order->paid_at) {
                $updates['paid_at'] = now();
            } elseif ($newStatus === 'delivered') {
                if (!$order->delivered_at) {
                    $updates['delivered_at'] = now();
                }
                if (!$order->paid_at) {
                    $updates['paid_at'] = now();
                }
            }

            $order->update($updates);
        }

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function destroy(Order $order)
    {
        // Restore stock jika order yang dihapus masih pending
        if ($order->status === 'pending') {
            $order->load('items');
            foreach ($order->items as $item) {
                if ($item->product_variant_id) {
                    \App\Models\ProductVariant::where('id', $item->product_variant_id)
                        ->increment('stock', $item->quantity);
                }
            }
        }

        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order berhasil dihapus.');
    }
}
