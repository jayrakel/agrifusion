// src/app/(public)/order-success/page.tsx
'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const order  = params.get('order');
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6 py-24">
      <div className="card rounded-3xl p-14 max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full grad-green flex items-center justify-center text-white text-4xl mx-auto mb-6">✓</div>
        <h1 className="font-heading font-black text-3xl text-green-900 dark:text-green-100 mb-3">Order Placed!</h1>
        <p className="text-[var(--text-3)] mb-6">Thank you for your order. We've sent a confirmation to your email.</p>
        {order && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 mb-8">
            <p className="text-xs text-green-600 mb-1">Order Number</p>
            <p className="font-heading font-black text-2xl text-green-700 dark:text-green-300">#{order}</p>
          </div>
        )}
        <p className="text-sm text-green-600 dark:text-green-400 mb-8">Your order is being prepared and will be delivered soon. You can track it below.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/track?order=${order}`} className="btn-primary">📦 Track Order</Link>
          <Link href="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
