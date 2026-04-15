"use client";
import { useEffect, useState } from "react";
export default function SubscribersAdmin() {
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(()=>{fetch("/api/admin/subscribers",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setSubs(d));},[]);
  const active = subs.filter(s=>s.status==="ACTIVE").length;
  return (
    <div className="p-8">
      <div className="mb-6"><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Subscribers</h1><p className="text-green-500 text-sm">{active} active · {subs.length} total</p></div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{l:"Active",v:active},{l:"Pending",v:subs.filter(s=>s.status==="PENDING").length},{l:"Unsubscribed",v:subs.filter(s=>s.status==="UNSUBSCRIBED").length}].map(s=>(
          <div key={s.l} className="card rounded-2xl p-5 text-center"><div className="font-heading font-black text-3xl grad-text mb-1">{s.v}</div><div className="text-green-500 text-xs uppercase tracking-wider">{s.l}</div></div>
        ))}
      </div>
      <div className="space-y-2">
        {subs.map(s=>(
          <div key={s.id} className="flex items-center gap-4 p-4 card rounded-2xl">
            <div className="w-8 h-8 rounded-full grad-green flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{s.email[0].toUpperCase()}</div>
            <div className="flex-1"><div className="font-medium text-sm text-green-900 dark:text-green-100">{s.email}</div>{s.name&&<div className="text-green-500 text-xs">{s.name}</div>}</div>
            <span className={"text-[10px] font-bold uppercase px-2.5 py-1 rounded-full "+(s.status==="ACTIVE"?"text-green-600 bg-green-50 dark:bg-green-900/30":s.status==="PENDING"?"text-yellow-600 bg-yellow-50":"text-gray-500 bg-gray-100")}>{s.status}</span>
            <span className="text-green-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {subs.length===0&&<div className="text-center py-16 text-green-500">No subscribers yet.</div>}
      </div>
    </div>
  );
}
