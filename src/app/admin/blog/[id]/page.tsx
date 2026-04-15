"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function BlogEditor() {
  const { id }  = useParams<{id:string}>();
  const router  = useRouter();
  const isNew   = id === "new";
  const [form, setForm] = useState({ title:"", excerpt:"", content:"", category:"Agriculture", tags:"", published:false, featured:false, coverImage:"" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(()=>{
    if(!isNew)fetch("/api/admin/blog/"+id,{credentials:"include"}).then(r=>r.json()).then(d=>{if(d)setForm({title:d.title||"",excerpt:d.excerpt||"",content:d.content||"",category:d.category||"Agriculture",tags:d.tags?.join(",")||"",published:d.published||false,featured:d.featured||false,coverImage:d.coverImage||""});});
  },[id,isNew]);
  const set = (k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const uploadImg = async (file:File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file",file); fd.append("folder","agrifusion/blog");
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd,credentials:"include"});
    const d   = await res.json();
    if(d.url){set("coverImage",d.url);toast.success("Image uploaded!");}
    setUploading(false);
  };
  const save = async () => {
    if(!form.title.trim()) return toast.error("Title required");
    setSaving(true);
    const payload = {...form,tags:form.tags.split(",").map((t:string)=>t.trim()).filter(Boolean)};
    const url  = isNew ? "/api/admin/blog" : "/api/admin/blog/"+id;
    const meth = isNew ? "POST" : "PATCH";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),credentials:"include"});
    if(res.ok){toast.success(isNew?"Created!":"Saved!");if(isNew){const d=await res.json();router.push("/admin/blog/"+d.id);}}
    else toast.error("Save failed.");
    setSaving(false);
  };
  const inp = "inp";
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><button onClick={()=>router.back()} className="text-green-500 hover:text-green-700 text-sm">← Back</button><h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">{isNew?"New Post":"Edit Post"}</h1></div>
        <div className="flex gap-3">
          <button onClick={()=>set("published",!form.published)} className={"px-4 py-2 rounded-xl text-sm font-bold transition-all "+(form.published?"bg-green-100 text-green-700 dark:bg-green-900/50":"card text-green-600")}>{form.published?"● Published":"○ Draft"}</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm disabled:opacity-50">{saving?"Saving…":"Save Post"}</button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Title *</label><input className={inp} value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Post title..."/></div>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Excerpt</label><textarea className={inp} rows={3} value={form.excerpt} onChange={e=>set("excerpt",e.target.value)} placeholder="Brief summary..."/></div>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Content (HTML)</label><textarea className={"inp font-mono text-xs"} rows={20} value={form.content} onChange={e=>set("content",e.target.value)} placeholder="<h2>Introduction</h2><p>Your content..."/></div>
        </div>
        <div className="space-y-4">
          <div className="card rounded-2xl p-5 space-y-4">
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Category</label>
              <select className={inp} value={form.category} onChange={e=>set("category",e.target.value)}>
                {["Agriculture","Farming Tips","Seasonal Guide","News","Recipes","Business"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Tags</label><input className={inp} value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="farming, kenya, tips"/></div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e=>set("featured",e.target.checked)} className="accent-green-600 w-4 h-4"/>
              <span className="text-sm text-green-800 dark:text-green-200">Mark as Featured</span>
            </label>
          </div>
          <div className="card rounded-2xl p-5">
            <label className="block text-xs text-green-600 uppercase tracking-widest mb-3">Cover Image</label>
            {form.coverImage&&<img src={form.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-xl mb-3"/>}
            <input type="file" accept="image/*" className="hidden" id="cover-upload" onChange={e=>e.target.files?.[0]&&uploadImg(e.target.files[0])}/>
            <label htmlFor="cover-upload" className={"w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-green-200 dark:border-green-800 rounded-xl text-sm text-green-500 hover:border-green-400 cursor-pointer transition-all "+(uploading?"opacity-50":"")}>{uploading?"Uploading…":"📷 Upload Image"}</label>
          </div>
        </div>
      </div>
    </div>
  );
}
