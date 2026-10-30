'use client';

import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Truck, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderRecord {
  _id: string;
  orderStatus: string;
  createdAt?: string;
  totalPrice?: number;
  total?: number;
  user?: { name?: string; email?: string };
  shippingInfo?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    email?: string;
  };
  orderItems?: OrderItem[];
  paymentInfo?: {
    method?: string;
    status?: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch {
      // Keep existing orders if error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const loadOrders = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        if (isSubscribed) setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (isSubscribed) {
          if (Array.isArray(data)) {
            setOrders(data);
          }
          setLoading(false);
        }
      } catch {
        if (isSubscribed) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('userToken');
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
      }
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      setToastMessage(`Order status updated to ${newStatus}!`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(o => (o.orderStatus || '').toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="space-y-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Customer Orders</h2>
          <p className="text-xs text-gray-500">Live order fulfillment stored in MongoDB Docker instance</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchOrders}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {['All', 'Processing', 'In Transit', 'Delivered'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-gray-500 font-bold">Fetching real-time orders from MongoDB...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const orderId = order._id?.toString() || 'ORD-UNKNOWN';
            const shipping = order.shippingInfo || {};
            const customerName = shipping.name || order.user?.name || 'Customer';
            const customerPhone = shipping.phone || '+92 300 1234567';
            const customerAddress = `${shipping.address || ''}, ${shipping.city || 'Lahore'}`;
            const items = order.orderItems || [];
            const currentStatus = order.orderStatus || 'Processing';

            return (
              <div key={orderId} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-gray-900">
                      {orderId.length > 10 ? `ORD-${orderId.slice(-6).toUpperCase()}` : orderId}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      currentStatus === 'Delivered' 
                        ? 'bg-green-100 text-green-700' 
                        : currentStatus === 'In Transit' || currentStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentStatus === 'Delivered' ? <CheckCircle className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                      {currentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Update Status:</span>
                    <select
                      value={currentStatus}
                      onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 outline-none cursor-pointer"
                    >
                      <option value="Processing">Processing</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-gray-400 block mb-1">Customer Info</span>
                    <p className="font-bold text-gray-900 text-sm">{customerName}</p>
                    <p>{order.user?.email || shipping.email || 'Email provided at checkout'}</p>
                    <p className="font-medium text-gray-800 mt-0.5">{customerPhone}</p>
                  </div>

                  <div>
                    <span className="font-bold uppercase tracking-wider text-gray-400 block mb-1">Shipping Destination</span>
                    <p className="font-medium text-gray-800">{customerAddress}</p>
                    <p className="text-gray-400 mt-1">Payment: {order.paymentInfo?.method || 'COD'}</p>
                  </div>

                  <div>
                    <span className="font-bold uppercase tracking-wider text-gray-400 block mb-1">Items in Order</span>
                    <div className="space-y-1">
                      {items.map((it: OrderItem, idx: number) => (
                        <div key={idx} className="flex justify-between text-gray-800">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-bold text-gray-900">Rs. {it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-gray-900">
                      <span>Total:</span>
                      <span>Rs. {order.totalPrice || order.total || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-900 mb-1">No orders found</p>
          <p className="text-xs text-gray-500">Customer orders placed on the store will appear here in real time.</p>
        </div>
      )}
    </div>
  );
}
