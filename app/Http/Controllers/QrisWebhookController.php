<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QrisWebhookController extends Controller
{
    /**
     * Handle incoming webhook notification from Android forwarder (MacroDroid/etc).
     */
    public function handle(Request $request): JsonResponse
    {
        // 1. Verifikasi Secret Key
        $configuredSecret = config('services.qris.webhook_secret');
        if (!empty($configuredSecret)) {
            $providedSecret = $request->header('X-Webhook-Secret')
                ?: $request->bearerToken()
                ?: $request->query('secret');

            if ($providedSecret !== $configuredSecret) {
                Log::warning('QRIS Webhook: Unauthorized access attempt', [
                    'ip' => $request->ip(),
                    'provided_secret' => $providedSecret,
                ]);

                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }

        // 2. Baca isi notifikasi (title, message/text/body, dan raw content)
        $title = (string) $request->input('title', '');
        $message = (string) $request->input('message', $request->input('text', $request->input('body', '')));
        $raw = (string) $request->getContent();
        $combinedText = trim("{$title} {$message} {$raw}");

        Log::info('QRIS Webhook received', [
            'title' => $title,
            'message' => $message,
            'ip' => $request->ip(),
        ]);

        // 3. Ekstrak nominal dari teks notifikasi
        // Format umum GoPay Merchant: "Rp 100 di Kenzo Mart..." atau "Rp 15.234 di Kenzo Mart..."
        if (!preg_match('/Rp\.?\s*([0-9.,]+)/i', $combinedText, $matches)) {
            Log::warning('QRIS Webhook: Format nominal Rp tidak ditemukan pada notifikasi', [
                'text' => $combinedText,
            ]);

            return response()->json([
                'status' => 'ignored',
                'reason' => 'Nominal not found in payload',
            ], 200);
        }

        $rawAmount = $matches[1];
        // Hilangkan desimal sen jika ada (misal ,00)
        $clean = preg_replace('/,[0-9]{2}$/', '', $rawAmount);
        $amount = (int) preg_replace('/[^0-9]/', '', $clean);

        if ($amount <= 0) {
            return response()->json([
                'status' => 'ignored',
                'reason' => 'Parsed amount is zero or invalid',
            ], 200);
        }

        // 4. Cari pesanan pending yang memiliki total_amount sesuai nominal
        $order = Order::query()
            ->where('status', 'pending')
            ->where('total_amount', $amount)
            ->where(function ($query) {
                $query->whereNull('expired_at')->orWhere('expired_at', '>', now());
            })
            ->latest()
            ->first();

        if (!$order) {
            Log::warning('QRIS Webhook: Tidak ditemukan order pending yang cocok dengan nominal', [
                'amount' => $amount,
                'text' => $combinedText,
            ]);

            return response()->json([
                'status' => 'ignored',
                'message' => "No matching pending order found for amount Rp {$amount}",
            ], 200);
        }

        // 5. Update status order menjadi PAID
        $order->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => 'qris_gopay',
            'payment_reference' => 'GOPAY-' . now()->format('YmdHis') . '-' . $amount,
            'notes' => trim(($order->notes ? $order->notes . ' | ' : '') . 'Paid via GoPay QRIS: ' . substr($message ?: $combinedText, 0, 150)),
        ]);

        Log::info('QRIS Webhook: Order berhasil ditandai LUNAS (PAID)', [
            'invoice' => $order->invoice_number,
            'amount' => $amount,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Order {$order->invoice_number} successfully marked as PAID",
            'invoice' => $order->invoice_number,
            'amount' => $amount,
        ]);
    }
}
