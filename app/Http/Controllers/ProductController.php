<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;

class ProductController extends Controller
{
    public function index()
    {
        // request('searh') ဆိိုတဲ့ global function ပါလာရင် when( '', fun() {}) ထဲက အလုပ် လုပ်မယ်။ မပါရင် ->orderBy နဲ့ ဆက်လုပ်မယ်
        return Product::when(request('search'), function($query) {
            $query->where('name', 'like', '%' . request('search') . '%');
        })->orderBy('id', 'desc')->get();
    }


    public function store(ProductStoreRequest $request)
    {
        $product = Product::create($request->only('name', 'price'));
        return $product;
    }


    public function show(Product $product)
    {
        return $product;
    }


    public function update(ProductUpdateRequest $request, Product $product)
    {
        $product->update($request->only('name', 'price'));
        return $product;
    }


    public function destroy(Product $product)
    {
        $product->delete();
        return $product;
    }
}
