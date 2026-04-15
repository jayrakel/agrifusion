"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const STATUSES = ['PENDING','CONFIRMED','PROCESSING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

export default function OrderDetail() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`,{credentials:'include'}).then(r=>r.json()).then(setOrder);
  },[id]);

  const update = async (data: any) => {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),credentials:'include'});
    if(res.ok){const d=await res.json();setOrder(d);toast.success('Order updated!');}
    else toast.error('Update failed.');
    setSaving(false);
  };

  if(!order) return <div className="p-8 text-green-500 animate-pulse">Loading order…</div>;

  const sc: Record<string,string> = {PENDING:'text-yellow-600 bg-yellow-50',CONFIRMED:'text-blue-600 bg-blue-50',PROCESSING:'text-purple-600 bg-purple-50',OUT_FOR_DELIVERY:'text-orange-600 bg-orange-50',DELIVERED:'text-green-600 bg-green-50',CANCELLED:'text-red-600 bg-red-50'};
  const inp = 'px-4 py-2.5 bg-white dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-900 dark:text-green-100 focus:outline-none focus:border-green-500 transition-all';

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={()=>router.back()} className="text-green-500 hover:text-green-700 text-sm mb-6 flex items-center gap-1">← Back to Orders</button>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">#{order.orderNumber}</h1><p className="text-green-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p></div>
        <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full ${sc[order.status]||''}`}>{order.status}</span>
      </div>

      <div className="grid gap-5">
        <div className="card rounded-2xl p-6">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100 mb-4">Customer</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[['Name',order.customerName],['Email',order.customerEmail],['Phone',order.customerPhone],['City',order.city]].map(([l,v])=>(
              <div key={l}><p className="text-xs text-green-500 uppercase tracking-widest mb-1">{l}</p><p className="text-green-900 dark:text-green-100 font-medium">{v}</p></div>
            ))}
            <div className="col-span-2"><p className="text-xs text-green-500 uppercase tracking-widest mb-1">Address</p><p className="text-green-900 dark:text-green-100 font-medium">{order.deliveryAddress}</p></div>
            {order.notes&&<div className="col-span-2"><p className="text-xs text-green-500 uppercase tracking-widest mb-1">Notes</p><p className="text-green-700 italic">{order.notes}</p></div>}
          </div>
        </div>

        <div className="card rounded-2xl p-6">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100 mb-4">Items</h2>
          <div className="space-y-2 mb-4">
            {order.items?.map((item:any)=>(
              <div key={item.id} className="flex justify-between text-sm py-2 border-b border-green-100 dark:border-green-900 last:border-0">
                <span className="text-green-800 dark:text-green-200">{item.name} <span className="text-green-500">× {item.quantity} {item.unit}</span></span>
                <span className="font-bold text-green-800 dark:text-green-200">KES {item.total?.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-green-600"><span>Subtotal</span><span>KES {order.subtotal?.toLocaleString()}</span></div>
            <div className="flex justify-between text-green-600"><span>Delivery</span><span>KES {order.deliveryFee?.toLocaleString()}</span></div>
            <div className="flex justify-between font-black text-base text-green-900 dark:text-green-100 pt-2 border-t border-green-100 dark:border-green-900"><span>Total</span><span>KES {order.total?.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="card rounded-2xl p-6">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100 mb-4">Update Order</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-green-500 uppercase tracking-widest mb-2">Order Status</label>
              <select className={`${inp} w-full`} value={order.status} onChange={e=>update({status:e.target.value})}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-green-500 uppercase tracking-widest mb-2">Payment Status</label>
              <select className={`${inp} w-full`} value={order.paymentStatus} onChange={e=>update({paymentStatus:e.target.value})}>
                {['UNPAID','PAID','REFUNDED'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
