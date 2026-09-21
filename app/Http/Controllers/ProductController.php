<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));

        $query = Product::query()
            ->where('is_active', true)
            ->with(['categories:id,name,slug', 'variants' => function ($q) {
                $q->where('is_active', true)->orderBy('price');
            }])
            ->latest();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('categories', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $products = $query->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'image' => $product->image,
                    'categories' => $product->categories->map(fn($c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'slug' => $c->slug,
                    ]),
                    'variants' => $product->variants->map(fn($v) => [
                        'id' => $v->id,
                        'name' => $v->name,
                        'duration' => $v->duration,
                        'account_type' => $v->account_type,
                        'price' => (float) $v->price,
                        'stock' => $v->stock,
                    ]),
                    'min_price' => $product->variants->min('price'),
                ];
            });

        return Inertia::render('Product/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['categories:id,name,slug', 'variants' => function ($q) {
                $q->where('is_active', true)->orderBy('price');
            }])
            ->firstOrFail();

        return Inertia::render('Product/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'image' => $product->image,
                'categories' => $product->categories->map(fn($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                ]),
                'variants' => $product->variants->map(fn($v) => [
                    'id' => $v->id,
                    'name' => $v->name,
                    'duration' => $v->duration,
                    'account_type' => $v->account_type,
                    'price' => (float) $v->price,
                    'stock' => $v->stock,
                ]),
            ],
        ]);
    }
}
