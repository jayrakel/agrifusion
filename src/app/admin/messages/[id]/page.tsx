"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
export default function MessageDetail() {
  const { id } = useParams<{id:string}>();
  const router  = useRouter();
  const [msg, setMsg] = useState<any>(null);
  useEffect(()=>{if(id)fetch("/api/admin/messages/"+id,{credentials:"include"}).then(r=>r.json()).then(setMsg);},[id]);
  const del = async () => {
    if(!confirm("Delete this message?")) return;
    await fetch("/api/admin/messages/"+id,{method:"DELETE",credentials:"include"});
    router.push("/admin/messages");
  };
  if(!msg) return <div className="p-8 text-green-500 animate-pulse">Loading…</div>;
  return (
    <div className="p-8 max-w-2xl">
      <button onClick={()=>router.back()} className="text-green-500 hover:text-green-700 text-sm mb-6 flex items-center gap-1">← Back to Messages</button>
      <div className="card rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full grad-green flex items-center justify-center text-white font-bold text-lg">{msg.name[0]}</div>
            <div><div className="font-heading font-bold text-lg text-green-900 dark:text-green-100">{msg.name}</div><a href={"mailto:"+msg.email} className="text-green-600 text-sm hover:underline">{msg.email}</a>{msg.phone&&<span className="text-green-500 text-sm ml-3">{msg.phone}</span>}</div>
          </div>
          <div className="text-xs text-green-500">{new Date(msg.createdAt).toLocaleString()}</div>
        </div>
        {msg.subject&&<div className="mb-3"><span className="text-xs text-green-500 uppercase tracking-widest">Subject: </span><span className="font-bold text-green-800 dark:text-green-200">{msg.subject}</span></div>}
        <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-900 dark:text-green-100 leading-relaxed whitespace-pre-wrap">{msg.message}</div>
      </div>
      <div className="flex gap-3">
        <a href={"mailto:"+msg.email} className="btn-primary text-sm">📧 Reply via Email</a>
        {msg.phone&&<a href={"https://wa.me/"+msg.phone.replace(/\D/g,"")} target="_blank" rel="noopener" className="btn-outline text-sm">💬 WhatsApp</a>}
        <button onClick={del} className="px-4 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-sm font-bold transition-all ml-auto">Delete</button>
      </div>
    </div>
  );
}
