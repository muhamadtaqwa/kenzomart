<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\DuitkuService;
use App\Services\QrisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    protected DuitkuService $duitku;
    protected QrisService $qris;

    public function __construct(DuitkuService $duitku, QrisService $qris)
    {
        $this->duitku = $duitku;
        $this->qris = $qris;
    }

    public function show(string $slug, Request $request)
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['variants' => function ($q) {
                $q->where('is_active', true);
            }])
            ->firstOrFail();

        $variant = $request->variant
            ? $product->variants->firstWhere('id', (int) $request->variant)
            : $product->variants->first();

        if (!$variant) {
            return redirect()->route('products.show', $slug)
                ->withErrors(['variant' => 'Varian produk tidak ditemukan.']);
        }

        if ($variant->stock <= 0) {
            return redirect()->route('products.show', $slug)
                ->withErrors(['variant' => 'Stok varian produk ini sedang habis.']);
        }

        return Inertia::render('Checkout/Form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image' => $product->image,
            ],
            'variant' => [
                'id' => $variant->id,
                'name' => $variant->name,
                'duration' => $variant->duration,
                'account_type' => $variant->account_type,
                'price' => (float) $variant->price,
                'stock' => $variant->stock,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'required|exists:product_variants,id',
            'phone' => 'required|string|min:9|max:20',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $variant = ProductVariant::findOrFail($validated['variant_id']);

        if ($variant->product_id !== $product->id) {
            abort(400, 'Varian tidak cocok dengan produk');
        }

        if ($variant->stock <= 0) {
            return back()->withErrors(['variant_id' => 'Stok varian habis.']);
        }

        $basePrice = (int) round($variant->price);
        $uniqueCode = $this->generateUniqueCode($basePrice);
        $totalAmount = $basePrice + $uniqueCode;

        try {
            $dynamicQris = $this->qris->generateDynamicQris($totalAmount);
        } catch (\Exception $e) {
            Log::error('QRIS error saat checkout', ['error' => $e->getMessage()]);
            return back()->withErrors(['variant_id' => 'Gagal memproses QRIS: ' . $e->getMessage()]);
        }

        $expiryMinutes = (int) config('services.qris.expiry_minutes', 30);

        // Bikin Order
        $order = DB::transaction(function () use ($validated, $product, $variant, $totalAmount, $uniqueCode, $dynamicQris, $expiryMinutes) {
            $customer = Customer::firstOrCreate(
                ['phone' => $validated['phone']],
                ['email' => null]
            );

            $order = Order::create([
                'invoice_number' => $this->generateInvoiceNumber(),
                'customer_id' => $customer->id,
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'unique_code' => $uniqueCode,
                'payment_method' => 'qris',
                'payment_reference' => 'QRIS-' . now()->format('YmdHis'),
                'qr_string' => $dynamicQris,
                'expired_at' => now()->addMinutes($expiryMinutes),
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant->id,
                'product_name' => $product->name,
                'variant_name' => $variant->name,
                'delivery_content' => $variant->delivery_content,   // ← snapshot
                'price' => $variant->price,
                'quantity' => 1,
                'subtotal' => $variant->price,
            ]);

            $variant->decrement('stock');

            return $order;
        });

        Log::info('QRIS Order created', [
            'order' => $order->invoice_number,
            'total' => $totalAmount,
            'unique_code' => $uniqueCode,
        ]);

        return redirect()->route('checkout.payment', ['invoice' => $order->invoice_number]);
    }

    public function payment(string $invoice): Response
    {
        $order = Order::query()
            ->where('invoice_number', $invoice)
            ->with(['customer', 'items.product'])
            ->firstOrFail();

        return Inertia::render('Checkout/Payment', [
            'order' => [
                'id' => $order->id,
                'invoice_number' => $order->invoice_number,
                'total_amount' => (float) $order->total_amount,
                'unique_code' => (int) $order->unique_code,
                'status' => $order->status,
                'qr_string' => $order->qr_string,
                'payment_reference' => $order->payment_reference,
                'expired_at' => $order->expired_at?->toIso8601String(),
                'paid_at' => $order->paid_at?->format('d M Y H:i'),
                'created_at' => $order->created_at->format('d M Y H:i'),
                'customer' => [
                    'phone' => $order->customer->phone,
                ],
                'items' => $order->items->map(fn($item) => [
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

    public function status(string $invoice)
    {
        $order = Order::where('invoice_number', $invoice)->firstOrFail();

        // Auto-expire seketika jika pending dan waktu expired_at sudah lewat
        if ($order->status === 'pending' && $order->expired_at && $order->expired_at->isPast()) {
            $order->load('items');
            foreach ($order->items as $item) {
                if ($item->product_variant_id) {
                    ProductVariant::where('id', $item->product_variant_id)
                        ->increment('stock', $item->quantity);
                }
            }

            $order->update([
                'status' => 'expired',
                'notes' => ($order->notes ? $order->notes . ' | ' : '') . 'Auto-expired on status check',
            ]);
        } elseif ($order->status === 'pending' && $order->duitku_reference) {
            try {
                $duitkuStatus = $this->duitku->checkTransaction($order->invoice_number);

                if (isset($duitkuStatus['statusCode']) && $duitkuStatus['statusCode'] === '00') {
                    $order->update([
                        'status' => 'paid',
                        'paid_at' => now(),
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Gagal cek status Duitku', [
                    'order' => $invoice,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Kirim delivery_content kalau udah paid
        $items = [];
        if (in_array($order->status, ['paid', 'delivered'])) {
            $order->load('items');
            $items = $order->items->map(fn($item) => [
                'product_name' => $item->product_name,
                'variant_name' => $item->variant_name,
                'delivery_content' => $item->delivery_content,
            ])->toArray();
        }

        return response()->json([
            'status' => $order->status,
            'paid_at' => $order->paid_at?->toIso8601String(),
            'items' => $items,
        ]);
    }

    private function generateInvoiceNumber(): string
    {
        $prefix = 'INV-' . now()->format('Ymd') . '-';

        do {
            $token = strtoupper(\Illuminate\Support\Str::random(6));
            $invoice = $prefix . $token;
        } while (Order::where('invoice_number', $invoice)->exists());

        return $invoice;
    }

    private function generateUniqueCode(int $basePrice): int
    {
        // Ambil total_amount semua order pending yang masih aktif
        $activeAmounts = Order::query()
            ->where('status', 'pending')
            ->where(function ($q) {
                $q->whereNull('expired_at')->orWhere('expired_at', '>', now());
            })
            ->pluck('total_amount')
            ->map(fn($val) => (int) round($val))
            ->toArray();

        // Cari kode acak 1..499 yang belum bentrok
        for ($attempts = 0; $attempts < 50; $attempts++) {
            $code = random_int(1, 499);
            if (!in_array($basePrice + $code, $activeAmounts)) {
                return $code;
            }
        }

        // Jika padat, cari berurutan 1..999
        for ($code = 1; $code <= 999; $code++) {
            if (!in_array($basePrice + $code, $activeAmounts)) {
                return $code;
            }
        }

        return random_int(1, 999);
    }
}
