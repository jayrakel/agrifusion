"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<any[]>([]);
  const load = () => fetch("/api/admin/reviews",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setReviews(d));
  useEffect(()=>{load();},[]);
  const approve = async (id:string, approved:boolean) => { await fetch("/api/admin/reviews/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({approved:!approved}),credentials:"include"}); load(); };
  const del = async (id:string) => { if(!confirm("Delete?")) return; await fetch("/api/admin/reviews/"+id,{method:"DELETE",credentials:"include"}); toast.success("Deleted"); load(); };
  return (
    <div className="p-8">
      <div className="mb-6"><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Reviews</h1><p className="text-green-500 text-sm">{reviews.filter(r=>!r.approved).length} pending approval</p></div>
      <div className="space-y-3">
        {reviews.map(r=>(
          <div key={r.id} className={"card rounded-2xl p-5 "+(r.approved?"":"border-amber-200 dark:border-amber-800")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-heading font-bold text-sm text-green-900 dark:text-green-100">{r.name}</span>
                  <div className="flex">{[...Array(5)].map((_,i)=><span key={i} className={i<r.rating?"text-amber-400":"text-gray-300"}>★</span>)}</div>
                  {!r.approved&&<span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold uppercase">Pending</span>}
                </div>
                <p className="text-xs text-green-500">{r.product?.name} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>approve(r.id,r.approved)} className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all "+(r.approved?"bg-yellow-50 text-yellow-600":"bg-green-50 text-green-600")}>{r.approved?"Unapprove":"Approve"}</button>
                <button onClick={()=>del(r.id)} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold">Delete</button>
              </div>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">{r.comment}</p>
          </div>
        ))}
        {reviews.length===0&&<div className="text-center py-16 text-green-500">No reviews yet.</div>}
      </div>
    </div>
  );
}
