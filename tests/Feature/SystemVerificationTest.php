<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_search_filters_correctly(): void
    {
        $p1 = Product::create([
            'name' => 'Netflix Premium UHD',
            'slug' => 'netflix-premium-uhd',
            'is_active' => true,
        ]);
        $p1->variants()->create([
            'name' => '1 Bulan',
            'price' => 35000,
            'stock' => 10,
            'delivery_type' => 'account',
            'is_active' => true,
        ]);

        $p2 = Product::create([
            'name' => 'Spotify Family Plan',
            'slug' => 'spotify-family-plan',
            'is_active' => true,
        ]);
        $p2->variants()->create([
            'name' => '1 Bulan',
            'price' => 25000,
            'stock' => 5,
            'delivery_type' => 'link',
            'is_active' => true,
        ]);

        $response = $this->get('/produk?search=Netflix');
        $response->assertStatus(200);

        $products = $response->viewData('page')['props']['products'];
        $this->assertCount(1, $products);
        $this->assertEquals('Netflix Premium UHD', $products[0]['name']);
    }

    public function test_checkout_show_fallback_to_first_variant(): void
    {
        $product = Product::create([
            'name' => 'Canva Pro',
            'slug' => 'canva-pro',
            'is_active' => true,
        ]);
        $variant = $product->variants()->create([
            'name' => '1 Tahun',
            'price' => 50000,
            'stock' => 10,
            'delivery_type' => 'link',
            'is_active' => true,
        ]);

        // Request without ?variant=
        $response = $this->get('/checkout/canva-pro');
        $response->assertStatus(200);
        $this->assertEquals($variant->id, $response->viewData('page')['props']['variant']['id']);
    }

    public function test_duitku_failed_callback_restores_stock(): void
    {
        config([
            'services.duitku.merchant_code' => 'TEST_CODE',
            'services.duitku.api_key' => 'TEST_KEY',
        ]);

        $product = Product::create(['name' => 'YouTube Premium', 'slug' => 'youtube-prem', 'is_active' => true]);
        $variant = $product->variants()->create([
            'name' => '3 Bulan',
            'price' => 15000,
            'stock' => 2, // Decremented to 2
            'delivery_type' => 'account',
            'is_active' => true,
        ]);

        $customer = Customer::create(['phone' => '081122334455', 'email' => null]);
        $order = Order::create([
            'invoice_number' => 'INV-20260921-TEST01',
            'customer_id' => $customer->id,
            'status' => 'pending',
            'total_amount' => 15000,
            'expired_at' => now()->addMinutes(30),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'product_name' => $product->name,
            'variant_name' => $variant->name,
            'delivery_content' => 'yt:pass123',
            'price' => 15000,
            'quantity' => 1,
            'subtotal' => 15000,
        ]);

        $amount = '15000';
        $invoice = 'INV-20260921-TEST01';
        $signature = md5('TEST_CODE' . $amount . $invoice . 'TEST_KEY');

        $response = $this->postJson('/payment/duitku-callback', [
            'merchantCode' => 'TEST_CODE',
            'amount' => $amount,
            'merchantOrderId' => $invoice,
            'signature' => $signature,
            'resultCode' => '01', // Failed
            'reference' => 'REF001',
        ]);

        $response->assertStatus(200);

        $order->refresh();
        $variant->refresh();

        $this->assertEquals('failed', $order->status);
        $this->assertEquals(3, $variant->stock); // Restored from 2 to 3
    }

    public function test_checkout_status_auto_expires_when_time_passed(): void
    {
        $product = Product::create(['name' => 'VPN Premium', 'slug' => 'vpn-prem', 'is_active' => true]);
        $variant = $product->variants()->create([
            'name' => '1 Bulan',
            'price' => 20000,
            'stock' => 5,
            'delivery_type' => 'account',
            'is_active' => true,
        ]);

        $customer = Customer::create(['phone' => '085566778899', 'email' => null]);
        $order = Order::create([
            'invoice_number' => 'INV-20260921-EXPIRE',
            'customer_id' => $customer->id,
            'status' => 'pending',
            'total_amount' => 20000,
            'expired_at' => now()->subMinute(), // Expired 1 min ago
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'product_name' => $product->name,
            'variant_name' => $variant->name,
            'delivery_content' => 'vpn:pass',
            'price' => 20000,
            'quantity' => 1,
            'subtotal' => 20000,
        ]);

        $response = $this->getJson('/checkout/INV-20260921-EXPIRE/status');
        $response->assertStatus(200);
        $response->assertJson(['status' => 'expired']);

        $variant->refresh();
        $this->assertEquals(6, $variant->stock); // 5 + 1 restored
    }

    public function test_order_check_sanitizes_spaces_and_casing(): void
    {
        $customer = Customer::create(['phone' => '089988776655']);
        Order::create([
            'invoice_number' => 'INV-20260921-TRIMTEST',
            'customer_id' => $customer->id,
            'status' => 'paid',
            'total_amount' => 30000,
        ]);

        // Lowercase with leading and trailing spaces
        $response = $this->post('/cek-pesanan', [
            'invoice_number' => '  inv-20260921-trimtest  ',
        ]);

        $response->assertRedirect('/cek-pesanan/INV-20260921-TRIMTEST');
    }

    public function test_admin_orders_show_includes_delivery_content(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('secret'),
        ]);

        $product = Product::create(['name' => 'Disney Hotstar', 'slug' => 'disney-hotstar', 'is_active' => true]);
        $customer = Customer::create(['phone' => '081234567890']);
        $order = Order::create([
            'invoice_number' => 'INV-TEST-ADMIN',
            'customer_id' => $customer->id,
            'status' => 'paid',
            'total_amount' => 40000,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'variant_name' => '1 Bulan',
            'delivery_content' => 'disney:secret123',
            'price' => 40000,
            'quantity' => 1,
            'subtotal' => 40000,
        ]);

        $response = $this->actingAs($admin)->get("/dashboard/orders/{$order->id}");
        $response->assertStatus(200);

        $itemData = $response->viewData('page')['props']['order']['items'][0];
        $this->assertEquals('disney:secret123', $itemData['delivery_content']);
    }

    public function test_admin_update_status_restores_stock_when_expired(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin2@test.com',
            'password' => bcrypt('secret'),
        ]);

        $product = Product::create(['name' => 'Steam Wallet', 'slug' => 'steam-wallet', 'is_active' => true]);
        $variant = $product->variants()->create([
            'name' => '12000 IDR',
            'price' => 12000,
            'stock' => 3,
            'delivery_type' => 'link',
            'is_active' => true,
        ]);

        $customer = Customer::create(['phone' => '087711223344']);
        $order = Order::create([
            'invoice_number' => 'INV-STATUS-TEST',
            'customer_id' => $customer->id,
            'status' => 'pending',
            'total_amount' => 12000,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'product_name' => $product->name,
            'variant_name' => $variant->name,
            'price' => 12000,
            'quantity' => 1,
            'subtotal' => 12000,
        ]);

        $response = $this->actingAs($admin)->patch("/dashboard/orders/{$order->id}/status", [
            'status' => 'expired',
        ]);

        $response->assertSessionHas('success');
        $variant->refresh();
        $this->assertEquals(4, $variant->stock); // 3 + 1 restored
    }
}
