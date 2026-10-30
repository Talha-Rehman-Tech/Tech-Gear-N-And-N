'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Minus, 
  Plus, 
  CheckCircle2,
  Package,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { GsapFadeIn, GsapStaggerGrid } from '@/components/GsapAnimations';
import { DEFAULT_PRODUCTS, ProductItem } from '@/data/products';
import { API_BASE_URL } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || '';

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  const relatedProducts = useMemo(
    () => DEFAULT_PRODUCTS.filter((p) => p._id !== productId).slice(0, 4),
    [productId]
  );

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let isMounted = true;
    if (!productId) return;

    Promise.resolve().then(() => {
      if (isMounted) setLoading(true);
    });

    fetch(`${API_BASE_URL}/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          if (data && data.variants && data.variants.length > 0) {
            setSelectedColor(data.variants[0].color);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        // Fallback search
        const match = DEFAULT_PRODUCTS.find(p => p._id === productId);
        if (isMounted) {
          setProduct(match || DEFAULT_PRODUCTS[0]);
          if (match?.variants?.length) {
            setSelectedColor(match.variants[0].color);
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleAddToCart = (redirect = false) => {
    if (!product) return;
    const imgUrl = product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/600';
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: imgUrl,
      quantity: quantity,
      color: selectedColor || 'Default',
    });

    if (redirect) {
      router.push('/cart');
    } else {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">The product you are looking for does not exist or may have been removed.</p>
        <Link href="/category/all" className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
          Browse All Products
        </Link>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/800' }];
  const currentImage = imagesList[selectedImageIndex]?.url || imagesList[0].url;
  const isDiscounted = product.discountPrice && product.discountPrice > product.price;

  return (
    <div className="w-full min-h-screen bg-[#fafafa] py-8 sm:py-12">
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Added to Cart!</span>
          <Link href="/cart" className="text-xs font-bold underline ml-2 text-yellow-300">
            Go to Cart →
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/category/all" className="hover:text-black">Catalog</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        <GsapFadeIn direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xs">
            
            {/* Product Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden relative border border-gray-100 group">
                <img 
                  src={currentImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {product.isFeatured && (
                  <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Featured
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {imagesList.map((img: { url: string }, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === i ? 'border-black ring-2 ring-black/10' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Controls */}
            <div className="flex flex-col justify-between">
              <div>
                {product.brand && (
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    {product.brand}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating & Stock */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current text-yellow-200" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {product.ratings || 4.8} ({product.numOfReviews || 24} reviews)
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900">Rs. {product.price}</span>
                  {isDiscounted && (
                    <span className="text-base text-gray-400 line-through">Rs. {product.discountPrice}</span>
                  )}
                  {isDiscounted && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      Save Rs. {(product.discountPrice || 0) - product.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Color Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">Select Variant</span>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((v: { color: string; stock: number }) => (
                        <button 
                          key={v.color} 
                          onClick={() => setSelectedColor(v.color)}
                          className={`px-4 py-2 border rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                            selectedColor === v.color 
                              ? 'border-black bg-black text-white shadow-xs' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {v.color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <div className="flex items-center justify-between sm:justify-start border border-gray-200 rounded-xl bg-gray-50 px-2 py-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-500 hover:text-black transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-500 hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 bg-white text-black border-2 border-black font-bold py-3.5 px-6 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    Add to Cart
                  </button>

                  <button 
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 bg-black text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" /> Buy Now
                  </button>
                </div>

              </div>

              {/* Specifications & Trust Badges */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                {product.specifications && product.specifications.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Specifications</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                      {product.specifications.map((spec: { key: string; value: string }, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                          <span className="font-bold text-gray-900">{spec.key}:</span>
                          <span>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl text-xs">
                    <Truck className="w-4 h-4 text-gray-700 shrink-0" />
                    <div>
                      <span className="font-bold block text-gray-900">Express Delivery</span>
                      <span className="text-gray-500">2-4 days nationwide</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl text-xs">
                    <ShieldCheck className="w-4 h-4 text-gray-700 shrink-0" />
                    <div>
                      <span className="font-bold block text-gray-900">6 Months Warranty</span>
                      <span className="text-gray-500">Official guarantee</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </GsapFadeIn>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <GsapFadeIn direction="up">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Recommended</span>
                  <h2 className="text-2xl font-black text-gray-900">You Might Also Like</h2>
                </div>
                <Link href="/category/all" className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </GsapFadeIn>

            <GsapStaggerGrid className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <div key={p._id} className="group bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <Link href={`/product/${p._id}`} className="block relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
                    <img src={p.images?.[0]?.url || 'https://via.placeholder.com/600'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{p.brand || 'TechGear'}</span>
                    <Link href={`/product/${p._id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline">{p.name}</h3>
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-base font-black text-gray-900">Rs. {p.price}</span>
                    <Link href={`/product/${p._id}`} className="p-2 bg-black text-white rounded-xl hover:scale-105 transition-transform">
                      <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </GsapStaggerGrid>
          </div>
        )}

      </div>
    </div>
  );
}
