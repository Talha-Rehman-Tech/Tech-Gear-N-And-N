'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';

interface CategoryItem {
  name: string;
  slug?: string;
  _id?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [categories, setCategories] = useState<CategoryItem[]>([
    { name: 'Fast Chargers', slug: 'fast-chargers' },
    { name: 'Audio & TWS', slug: 'audio' },
    { name: 'Durable Cables', slug: 'cables' },
    { name: 'Power Banks', slug: 'power-banks' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    stock: '50',
    category: 'fast-chargers',
    brand: 'TechGear',
    imageUrl: '',
    isFeatured: true
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then((data: CategoryItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setFormData(prev => ({ ...prev, category: data[0].slug || data[0]._id || 'fast-chargers' }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const newProduct = {
      name: formData.name.trim(),
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
      description: formData.description.trim(),
      stock: Number(formData.stock),
      category: formData.category,
      brand: formData.brand.trim() || 'TechGear',
      images: [{ url: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=800&auto=format&fit=crop', public_id: 'custom_upload' }],
      isFeatured: formData.isFeatured,
      ratings: 5.0,
      numOfReviews: 1
    };

    try {
      const token = localStorage.getItem('userToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newProduct)
      });
      
      if (res.ok) {
        router.push('/admin');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setErrorMsg(errorData.message || 'Failed to publish product. Please check your admin privileges.');
      }
    } catch {
      setErrorMsg('Cannot reach backend server. Please verify backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">Add New Inventory Item</h2>
          <p className="text-xs text-gray-500">Publish a new accessory to your store</p>
        </div>
      </div>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Product Name</label>
            <input 
              name="name" value={formData.name} onChange={handleChange} required
              type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" placeholder="e.g. 65W GaN Fast Charger Ultra Pro" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Selling Price (Rs.)</label>
            <input 
              name="price" value={formData.price} onChange={handleChange} required
              type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" placeholder="2999" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Original / Discount Price (Rs.)</label>
            <input 
              name="discountPrice" value={formData.discountPrice} onChange={handleChange}
              type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" placeholder="3499 (optional)" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Stock Quantity</label>
            <input 
              name="stock" value={formData.stock} onChange={handleChange} required
              type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" placeholder="50" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Brand</label>
            <input 
              name="brand" value={formData.brand} onChange={handleChange} required
              type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" placeholder="TechGear / Anker Tech" 
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Category</label>
            <select 
              name="category" value={formData.category} onChange={handleChange} required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all cursor-pointer"
            >
              {categories.map((cat: CategoryItem, i) => (
                <option key={i} value={cat.slug || cat._id || cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Image URL</label>
            <div className="flex gap-3 items-center">
              <input 
                name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                type="url" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" placeholder="https://images.unsplash.com/photo-..." 
              />
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Leave empty to use a high-quality default product image.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} required
              rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none resize-none transition-all" placeholder="Detailed product specifications, wattage, materials..."
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input 
                type="checkbox" 
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-xs font-bold text-gray-800">Feature this product in Trending / Homepage Showcase</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-black text-white px-7 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-900 transition-all shadow-md disabled:opacity-60">
            {loading ? 'Saving Product...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
