"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    fetch(`/api/admin/orders${filter!=='all'?`?status=${filter.toUpperCase()}`:''}`,{credentials:'include'}).then(r=>r.json()).then(d=>Array.isArray(d)&&setOrders(d));
  },[filter]);
  const sc: Record<string,string> = { PENDING:'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',CONFIRMED:'text-blue-600 bg-blue-50 dark:bg-blue-900/20',PROCESSING:'text-purple-600 bg-purple-50',OUT_FOR_DELIVERY:'text-orange-600 bg-orange-50',DELIVERED:'text-green-600 bg-green-50 dark:bg-green-900/20',CANCELLED:'text-red-600 bg-red-50 dark:bg-red-900/20' };
  const revenue = orders.filter(o=>o.paymentStatus==='PAID').reduce((s,o)=>s+o.total,0);
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Orders</h1><p className="text-green-500 text-sm">{orders.length} orders · KES {revenue.toLocaleString()} revenue</p></div>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','pending','confirmed','processing','out_for_delivery','delivered','cancelled'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter===f?'grad-green text-white':'card text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'}`}>{f.replace(/_/g,' ')}</button>
        ))}
      </div>
      <div className="space-y-2">
        {orders.map(o=>(
          <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center gap-4 p-4 card card-hover rounded-2xl">
            <div className="w-10 h-10 rounded-full grad-green flex items-center justify-center text-white font-bold flex-shrink-0">{o.customerName[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-heading font-bold text-sm text-green-900 dark:text-green-100">#{o.orderNumber}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${sc[o.status]||''}`}>{o.status}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${o.paymentStatus==='PAID'?'text-green-600 bg-green-50 dark:bg-green-900/20':'text-red-500 bg-red-50'}`}>{o.paymentStatus}</span>
              </div>
              <p className="text-green-500 text-xs truncate">{o.customerName} · {o.customerEmail}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-heading font-bold text-sm text-green-800 dark:text-green-200">KES {o.total?.toLocaleString()}</div>
              <div className="text-green-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</div>
            </div>
          </Link>
        ))}
        {orders.length===0&&<div className="text-center py-16 text-green-500">No orders found.</div>}
      </div>
    </div>
  );
}
