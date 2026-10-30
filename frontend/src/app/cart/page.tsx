'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { GsapFadeIn } from '@/components/GsapAnimations';

const emptySubscribe = () => () => {};

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium text-sm">Loading your cart items...</p>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const freeShippingThreshold = 2000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 150;
  const finalTotal = subtotal + shippingCost;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 min-h-[75vh]">
      <GsapFadeIn direction="up">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900">Your Shopping Cart</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Review items in your order before proceeding to checkout</p>
          </div>
          <span className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      </GsapFadeIn>

      {items.length === 0 ? (
        <GsapFadeIn direction="up">
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xs p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5 text-gray-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
              Discover top-rated fast chargers, ANC earbuds, and power banks to fill your cart.
            </p>
            <Link 
              href="/category/all" 
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all shadow-md hover:scale-105"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </GsapFadeIn>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {/* Free Shipping Meter */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-gray-800">
                  <Truck className="w-4 h-4 text-green-600" />
                  {isFreeShipping ? 'Congratulations! You unlocked FREE Delivery!' : `Add Rs. ${freeShippingThreshold - subtotal} more for FREE shipping!`}
                </span>
                <span className="text-gray-500">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {items.map((item) => (
              <div key={`${item.id}-${item.color}`} className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-gray-100 rounded-3xl shadow-xs hover:shadow-md transition-shadow">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link href={`/product/${item.id}`} className="font-bold text-gray-900 hover:underline line-clamp-2 text-sm sm:text-base">
                        {item.name}
                      </Link>
                      {item.color && (
                        <p className="text-xs text-gray-400 mt-1">Variant: <span className="font-semibold text-gray-700">{item.color}</span></p>
                      )}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id, item.color)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-xl"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.color)}
                        className="px-3 py-1.5 text-gray-500 hover:text-black transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}
                        className="px-3 py-1.5 text-gray-500 hover:text-black transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-black text-base sm:text-lg text-gray-900">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md sticky top-24 space-y-6">
              <h2 className="text-xl font-black text-gray-900 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-bold text-gray-900">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-gray-900">
                    {isFreeShipping ? <span className="text-green-600">FREE</span> : `Rs. ${shippingCost}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">
                  Rs. {finalTotal}
                </span>
              </div>

              <Link 
                href="/checkout" 
                className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>6 Months Guarantee & Easy Returns</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
