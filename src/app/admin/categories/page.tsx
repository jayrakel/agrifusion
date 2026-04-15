"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
export default function CategoriesAdmin() {
  const [cats, setCats] = useState<any[]>([]);
  const load = () => fetch("/api/admin/categories",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setCats(d));
  useEffect(()=>{load();},[]);
  const del = async (id:string) => {
    if(!confirm("Delete this category? Products will not be deleted but will lose their category.")) return;
    await fetch("/api/admin/categories/"+id,{method:"DELETE",credentials:"include"});
    toast.success("Deleted"); load();
  };
  const toggle = async (id:string, active:boolean) => {
    await fetch("/api/admin/categories/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({active:!active}),credentials:"include"});
    load();
  };
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Categories</h1><p className="text-green-500 text-sm">{cats.length} categories</p></div>
        <Link href="/admin/categories/new" className="btn-primary text-sm">+ Add Category</Link>
      </div>
      <div className="space-y-2">
        {cats.map(c=>(
          <div key={c.id} className="flex items-center gap-4 p-4 card card-hover rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl flex-shrink-0">{c.icon||"🌿"}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-heading font-bold text-sm text-green-900 dark:text-green-100">{c.name}</span>
                {!c.active&&<span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold uppercase">Hidden</span>}
                {c.featured&&<span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>}
              </div>
              <p className="text-green-500 text-xs">{c.description||"No description"}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={()=>toggle(c.id,c.active)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${c.active?"bg-yellow-50 text-yellow-600":"bg-green-50 text-green-600"}`}>{c.active?"Hide":"Show"}</button>
              <Link href={"/admin/categories/"+c.id} className="px-3 py-1.5 card text-xs text-green-700 dark:text-green-400 rounded-lg hover:bg-green-50 transition-all">Edit</Link>
              <button onClick={()=>del(c.id)} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold transition-all">Delete</button>
            </div>
          </div>
        ))}
        {cats.length===0&&<div className="text-center py-16 text-green-500">No categories yet.</div>}
      </div>
    </div>
  );
}
