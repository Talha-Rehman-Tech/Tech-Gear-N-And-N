'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, Search, ArrowLeft, Star, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { GsapFadeIn, GsapStaggerGrid } from '@/components/GsapAnimations';
import { ProductItem } from '@/data/products';
import { API_BASE_URL } from '@/lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [sortBy, setSortBy] = useState('recommended');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let isMounted = true;
    if (query) {
      Promise.resolve().then(() => {
        if (isMounted) setLoading(true);
      });
      const params = new URLSearchParams();
      params.set('keyword', query);
      if (sortBy) params.set('sortBy', sortBy);
      if (inStockOnly) params.set('inStock', 'true');

      fetch(`${API_BASE_URL}/products?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [query, sortBy, inStockOnly]);

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/600',
      quantity: 1,
      color: 'Default',
    });

    setAddedNotification(product.name);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[75vh]">
      {addedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Added <span className="font-bold">{addedNotification}</span> to cart!</span>
          <Link href="/cart" className="text-xs font-bold underline ml-2 text-yellow-300">View Cart</Link>
        </div>
      )}

      {/* Header */}
      <GsapFadeIn direction="up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Link href="/" className="hover:text-black flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Back</Link>
              <span>/</span>
              <span>Search</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {query ? `Results for "${query}"` : 'Search our Catalog'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3.5 py-2 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-black rounded"
              />
              In Stock Only
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-semibold text-gray-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </GsapFadeIn>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse flex flex-col gap-3">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <GsapStaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/600';
            const isDiscounted = product.discountPrice && product.discountPrice > product.price;

            return (
              <div
                key={product._id}
                className="group bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/product/${product._id}`} className="block relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3 border border-gray-100">
                    {product.isFeatured && (
                      <span className="absolute top-2.5 left-2.5 bg-black/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-xs">
                        Featured
                      </span>
                    )}
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="px-1">
                    {product.brand && (
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        {product.brand}
                      </span>
                    )}
                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline group-hover:text-black">
                        {product.name}
                      </h3>
                    </Link>

                    {product.ratings && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-gray-800">{product.ratings}</span>
                        <span className="text-gray-400">({product.numOfReviews || 10})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between px-1">
                  <div>
                    <span className="text-base font-black text-gray-900">Rs. {product.price}</span>
                    {isDiscounted && (
                      <div className="text-xs text-gray-400 line-through">Rs. {product.discountPrice}</div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="p-2.5 bg-black text-white rounded-xl hover:scale-105 transition-all shadow-xs flex items-center justify-center"
                    title="Add to Cart"
                  >
                    <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </GsapStaggerGrid>
      ) : (
        <GsapFadeIn direction="up">
          <div className="text-center py-20 bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products found for &quot;{query}&quot;</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Try checking for typos or browse our popular categories.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/category/fast-chargers" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold hover:border-black transition-colors">
                Fast Chargers
              </Link>
              <Link href="/category/audio" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold hover:border-black transition-colors">
                Audio & TWS
              </Link>
              <Link href="/category/power-banks" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold hover:border-black transition-colors">
                Power Banks
              </Link>
            </div>
          </div>
        </GsapFadeIn>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
