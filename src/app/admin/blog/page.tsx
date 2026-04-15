"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const load = () => fetch("/api/admin/blog",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setPosts(d));
  useEffect(()=>{load();},[]);
  const del = async (id:string) => { if(!confirm("Delete?")) return; await fetch("/api/admin/blog/"+id,{method:"DELETE",credentials:"include"}); toast.success("Deleted"); load(); };
  const toggle = async (id:string, published:boolean) => { await fetch("/api/admin/blog/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({published:!published}),credentials:"include"}); load(); };
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Blog Posts</h1><p className="text-green-500 text-sm">{posts.length} total articles</p></div>
        <Link href="/admin/blog/new" className="btn-primary text-sm">+ New Post</Link>
      </div>
      <div className="space-y-2">
        {posts.map(p=>(
          <div key={p.id} className="flex items-center gap-4 p-4 card card-hover rounded-2xl">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-heading font-bold text-sm text-green-900 dark:text-green-100 truncate">{p.title}</span>
                <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full "+(p.published?"text-green-600 bg-green-50 dark:bg-green-900/30":"text-yellow-600 bg-yellow-50")}>{p.published?"Published":"Draft"}</span>
              </div>
              <div className="flex gap-3 text-xs text-green-500"><span>{p.category}</span><span>{p.views||0} views</span><span>{new Date(p.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={()=>toggle(p.id,p.published)} className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all "+(p.published?"bg-yellow-50 text-yellow-600":"bg-green-50 text-green-600")}>{p.published?"Unpublish":"Publish"}</button>
              <Link href={"/admin/blog/"+p.id} className="px-3 py-1.5 card text-xs text-green-700 dark:text-green-400 rounded-lg hover:bg-green-50 transition-all">Edit</Link>
              <button onClick={()=>del(p.id)} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold">Delete</button>
            </div>
          </div>
        ))}
        {posts.length===0&&<div className="text-center py-16 text-green-500">No posts yet. <Link href="/admin/blog/new" className="text-green-600 hover:underline">Write your first →</Link></div>}
      </div>
    </div>
  );
}
