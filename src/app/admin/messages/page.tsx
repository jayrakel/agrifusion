"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function MessagesAdmin() {
  const [msgs, setMsgs] = useState<any[]>([]);
  useEffect(()=>{fetch("/api/admin/messages",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setMsgs(d));},[]);
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Messages</h1><p className="text-green-500 text-sm">{msgs.filter(m=>m.status==="UNREAD").length} unread</p></div>
      </div>
      <div className="space-y-2">
        {msgs.map(m=>(
          <Link key={m.id} href={"/admin/messages/"+m.id} className={"flex items-center gap-4 p-4 card card-hover rounded-2xl "+(!m.status||m.status==="UNREAD"?"border-green-300 dark:border-green-700":"")}>
            <div className="w-10 h-10 rounded-full grad-green flex items-center justify-center text-white font-bold flex-shrink-0">{m.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-heading font-bold text-sm text-green-900 dark:text-green-100">{m.name}</span>
                {m.status==="UNREAD"&&<span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                {m.subject&&<span className="text-[10px] text-green-500 bg-green-50 dark:bg-green-900/50 px-2 py-0.5 rounded-full">{m.subject}</span>}
              </div>
              <p className="text-green-500 text-xs truncate">{m.message}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-green-500 text-xs">{m.email}</div>
              <div className="text-green-400 text-[10px]">{new Date(m.createdAt).toLocaleDateString()}</div>
            </div>
          </Link>
        ))}
        {msgs.length===0&&<div className="text-center py-16 text-green-500">No messages yet.</div>}
      </div>
    </div>
  );
}
