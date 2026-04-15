'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const STATUS_STEPS = ['PENDING','CONFIRMED','PROCESSING','OUT_FOR_DELIVERY','DELIVERED'];
const STATUS_LABELS: Record<string,string> = {
  PENDING:'Order Received', CONFIRMED:'Order Confirmed', PROCESSING:'Being Prepared',
  OUT_FOR_DELIVERY:'Out for Delivery', DELIVERED:'Delivered', CANCELLED:'Cancelled',
};
const STATUS_ICONS: Record<string,string> = {
  PENDING:'📋', CONFIRMED:'✅', PROCESSING:'👨‍🍳', OUT_FOR_DELIVERY:'🚚', DELIVERED:'🎉', CANCELLED:'❌',
};

function TrackContent() {
  const params = useSearchParams();
  const [orderNum, setOrderNum] = useState(params.get('order') || '');
  const [email,    setEmail]    = useState('');
  const [order,    setOrder]    = useState<any>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const track = async () => {
    if (!orderNum.trim()) return setError('Enter your order number');
    setLoading(true); setError('');
    const res = await fetch(`/api/orders/${orderNum.toUpperCase().replace('#','')}?email=${encodeURIComponent(email)}`);
    const d   = await res.json();
    if (res.ok) setOrder(d);
    else setError(d.error || 'Order not found. Check the order number and try again.');
    setLoading(false);
  };

  const stepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16 px-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">📦</div>
          <h1 className="font-heading font-black text-3xl text-green-900 dark:text-green-100 mb-2">Track Your Order</h1>
          <p className="text-[var(--text-3)]">Enter your order number to see the latest status.</p>
        </div>

        <div className="card rounded-2xl p-8 mb-8">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Order Number *</label>
              <input className="inp" value={orderNum} onChange={e=>setOrderNum(e.target.value)} placeholder="e.g. AF-20240101-001" onKeyDown={e=>e.key==='Enter'&&track()} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Email (optional, for security)</label>
              <input type="email" className="inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="The email used for the order" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button onClick={track} disabled={loading} className="btn-primary w-full">
            {loading ? 'Searching…' : 'Track Order →'}
          </button>
        </div>

        {order && (
          <div className="card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-green-600 mb-1">Order Number</p>
                <p className="font-heading font-black text-xl text-green-900 dark:text-green-100">#{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 mb-1">Total</p>
                <p className="font-heading font-bold text-green-800 dark:text-green-200">KES {order.total?.toLocaleString()}</p>
              </div>
            </div>

            {/* Status stepper */}
            {order.status !== 'CANCELLED' ? (
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-green-100 dark:bg-green-900" />
                  <div className="absolute top-5 left-5 h-0.5 bg-green-500 transition-all" style={{ width: stepIdx > 0 ? `${(stepIdx / (STATUS_STEPS.length-1)) * (100 - 40/(STATUS_STEPS.length))}%` : '0%' }} />
                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex flex-col items-center gap-2 w-16">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm z-10 transition-all ${
                          i < stepIdx ? 'border-green-500 bg-green-500 text-white' :
                          i === stepIdx ? 'border-green-500 bg-white dark:bg-green-950 text-green-600 shadow-lg shadow-green-200' :
                          'border-green-200 bg-white dark:bg-green-950 dark:border-green-800 text-green-300'
                        }`}>
                          {i <= stepIdx ? STATUS_ICONS[step] : '○'}
                        </div>
                        <p className={`text-[10px] text-center leading-tight ${i === stepIdx ? 'text-green-700 dark:text-green-300 font-bold' : 'text-green-400'}`}>{STATUS_LABELS[step]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 text-center">
                <p className="text-red-600 font-bold">❌ This order has been cancelled</p>
              </div>
            )}

            {/* Items */}
            <div className="border-t border-green-100 dark:border-green-900 pt-5">
              <h3 className="font-heading font-bold text-sm mb-3 text-green-900 dark:text-green-100">Items Ordered</h3>
              <div className="space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-400">{item.name} × {item.quantity}</span>
                    <span className="font-bold text-green-800 dark:text-green-200">KES {item.total?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-green-100 dark:border-green-900 text-sm text-green-600 dark:text-green-400">
              <p>📍 Delivery to: {order.deliveryAddress}, {order.city}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() { return <Suspense><TrackContent /></Suspense>; }
