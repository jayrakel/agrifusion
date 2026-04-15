"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
export default function MediaAdmin() {
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const load = () => fetch("/api/admin/media",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setMedia(d));
  useEffect(()=>{load();},[]);
  const upload = async (file:File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file",file); fd.append("folder","agrifusion/library");
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd,credentials:"include"});
    const d   = await res.json();
    if(d.url){toast.success("Uploaded!"); load();}
    setUploading(false);
  };
  const del = async (id:string, publicId:string) => {
    await fetch("/api/admin/upload",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,publicId}),credentials:"include"});
    toast.success("Deleted"); load();
  };
  const copy = (url:string) => { navigator.clipboard.writeText(url); toast.success("URL copied!"); };
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">Media Library</h1><p className="text-green-500 text-sm">{media.length} files</p></div>
        <div>
          <input type="file" accept="image/*" multiple className="hidden" id="media-up" onChange={e=>{Array.from(e.target.files||[]).forEach(f=>upload(f));}}/>
          <label htmlFor="media-up" className={"btn-primary text-sm cursor-pointer "+(uploading?"opacity-50":"")}>
            {uploading?"Uploading…":"📤 Upload"}
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {media.map(m=>(
          <div key={m.id} className="card rounded-xl overflow-hidden">
            {m.type==="image"?<Image src={m.url} alt={m.name} width={200} height={150} className="w-full h-24 object-cover"/>:<div className="w-full h-24 bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-3xl">📄</div>}
            <div className="p-2">
              <p className="text-xs text-green-600 dark:text-green-400 truncate mb-2">{m.name}</p>
              <div className="flex gap-1">
                <button onClick={()=>copy(m.url)} className="flex-1 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 text-[10px] rounded font-bold hover:bg-green-100 transition-all">Copy</button>
                <button onClick={()=>del(m.id,m.publicId)} className="flex-1 py-1 bg-red-50 text-red-500 text-[10px] rounded font-bold hover:bg-red-100 transition-all">Del</button>
              </div>
            </div>
          </div>
        ))}
        {media.length===0&&<div className="col-span-6 text-center py-16 text-green-500">No media uploaded yet.</div>}
      </div>
    </div>
  );
}
