"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const load = () => fetch('/api/admin/products',{credentials:'include'}).then(r=>r.json()).then(d=>Array.isArray(d)&&setProducts(d));
  useEffect(()=>{load();},[]);
  const del = async (id:string) => {
    if(!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`,{method:'DELETE',credentials:'include'});
    toast.success('Deleted'); load();
  };
  const toggle = async (id:string, active:boolean) => {
    await fetch(`/api/admin/products/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({active:!active}),credentials:'include'});
    load();
  };
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Products</h1><p className="text-green-500 text-sm">{products.length} products</p></div>
        <Link href="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
      </div>
      <div className="space-y-2">
        {products.map(p=>(
          <div key={p.id} className="flex items-center gap-4 p-4 card card-hover rounded-2xl">
            <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/30 overflow-hidden flex-shrink-0">
              {p.images?.[0]?<Image src={p.images[0]} alt={p.name} width={56} height={56} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-heading font-bold text-sm text-green-900 dark:text-green-100 truncate">{p.name}</span>
                {p.organic&&<span className="badge-organic">🌱</span>}
                {!p.active&&<span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold uppercase">Hidden</span>}
                {p.featured&&<span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>}
              </div>
              <div className="text-green-500 text-xs">{p.category?.name} · KES {p.price?.toLocaleString()} / {p.unit} · Stock: {p.stock}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={()=>toggle(p.id,p.active)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${p.active?'bg-yellow-50 text-yellow-600 hover:bg-yellow-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>{p.active?'Hide':'Show'}</button>
              <Link href={`/admin/products/${p.id}`} className="px-3 py-1.5 card text-xs text-green-700 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all">Edit</Link>
              <button onClick={()=>del(p.id)} className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold transition-all">Delete</button>
            </div>
          </div>
        ))}
        {products.length===0&&<div className="text-center py-16 text-green-500">No products yet. <Link href="/admin/products/new" className="text-green-600 hover:underline">Add your first →</Link></div>}
      </div>
    </div>
  );
}
