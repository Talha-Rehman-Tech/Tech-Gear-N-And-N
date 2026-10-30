'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Package, AlertTriangle, Layers, ExternalLink } from 'lucide-react';
import { DEFAULT_PRODUCTS, ProductItem } from '@/data/products';
import { API_BASE_URL } from '@/lib/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Admin fetch warning:', err);
        setProducts(DEFAULT_PRODUCTS);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('userToken');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/products/${id}`, { 
        method: 'DELETE',
        headers
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert('Failed to delete product. Please verify you are logged in as admin.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) < 20).length;

  return (
    <div className="space-y-8">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Products</span>
            <p className="text-3xl font-black text-gray-900">{products.length}</p>
          </div>
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-md">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Stock Units</span>
            <p className="text-3xl font-black text-gray-900">{totalStock}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Low Stock Alert</span>
            <p className="text-3xl font-black text-red-600">{lowStockCount}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Store Status</span>
            <p className="text-lg font-bold text-green-600">Active & Live</p>
          </div>
          <Link href="/" target="_blank" className="p-3 bg-gray-50 text-gray-600 hover:text-black rounded-xl hover:bg-gray-100 transition-colors" title="View Storefront">
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Inventory Catalog</h3>
            <p className="text-xs text-gray-500">Manage all products, stock levels, and live pricing</p>
          </div>
          <Link 
            href="/admin/add-product" 
            className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-900 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">Loading inventory catalog...</td>
                </tr>
              ) : (
                products.map((product: ProductItem) => {
                const img = product.images?.[0]?.url || 'https://via.placeholder.com/150';
                return (
                  <tr key={product._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link href={`/product/${product._id}`} className="font-bold text-gray-900 hover:underline line-clamp-1">
                            {product.name}
                          </Link>
                          <span className="text-xs text-gray-400 block">ID: {product._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{product.brand || 'TechGear'}</td>
                    <td className="p-4 font-bold text-gray-900">Rs. {product.price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.stock > 20 
                          ? 'bg-green-100 text-green-700' 
                          : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/product/${product._id}`} 
                          className="p-2 text-gray-400 hover:text-black bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
