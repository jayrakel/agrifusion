"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function CategoryEditor() {
  const { id } = useParams<{id:string}>();
  const router  = useRouter();
  const isNew   = id === "new";
  const [form, setForm] = useState({ name:"",description:"",icon:"🌿",featured:false,active:true,order:0 });
  const [saving, setSaving] = useState(false);
  useEffect(()=>{
    if(!isNew) fetch("/api/admin/categories/"+id,{credentials:"include"}).then(r=>r.json()).then(d=>{if(d)setForm({name:d.name||"",description:d.description||"",icon:d.icon||"🌿",featured:d.featured||false,active:d.active!==false,order:d.order||0});});
  },[id,isNew]);
  const set = (k:string,v:any) => setForm(f=>({...f,[k]:v}));
  const save = async () => {
    if(!form.name.trim()) return toast.error("Name required");
    setSaving(true);
    const url = isNew ? "/api/admin/categories" : "/api/admin/categories/"+id;
    const res = await fetch(url,{method:isNew?"POST":"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form),credentials:"include"});
    if(res.ok){toast.success("Saved!"); router.push("/admin/categories");}
    else toast.error("Save failed.");
    setSaving(false);
  };
  const inp = "inp";
  const ICONS = ["🌿","🥬","🌱","🌾","🥛","🥩","🍅","🥑","🍯","🌽","🥦","⚒️","🧅","🧄","🫑","🍋"];
  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>router.back()} className="text-green-500 hover:text-green-700 text-sm">← Back</button>
        <h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">{isNew?"New Category":"Edit Category"}</h1>
      </div>
      <div className="space-y-5">
        <div className="card rounded-2xl p-6 space-y-4">
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Name *</label><input className={inp} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Fresh Produce"/></div>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Description</label><textarea className={inp} rows={2} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Brief description..."/></div>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-3">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic=>(
                <button key={ic} onClick={()=>set("icon",ic)} className={`w-10 h-10 rounded-xl text-xl transition-all ${form.icon===ic?"ring-2 ring-green-500 bg-green-50 dark:bg-green-900/50":"card hover:bg-green-50"}`}>{ic}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Display Order</label><input type="number" className={inp} value={form.order} onChange={e=>set("order",+e.target.value)}/></div>
          </div>
          <div className="flex gap-6">
            {[{k:"active",l:"✅ Active"},{k:"featured",l:"⭐ Featured on Homepage"}].map(f=>(
              <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                <div onClick={()=>set(f.k,!(form as any)[f.k])} className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${(form as any)[f.k]?"bg-green-500":"bg-gray-300"}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(form as any)[f.k]?"translate-x-4":""}`}/>
                </div>
                <span className="text-sm text-green-800 dark:text-green-200">{f.l}</span>
              </label>
            ))}
          </div>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary py-4 w-full disabled:opacity-50">{saving?"Saving…":"Save Category →"}</button>
      </div>
    </div>
  );
}
