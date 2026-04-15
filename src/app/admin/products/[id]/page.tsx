"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ProductEditor() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const isNew  = id === 'new';
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name:'',description:'',price:'',comparePrice:'',unit:'kg',stock:'0',categoryId:'',featured:false,organic:false,active:true,tags:'' });
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories',{credentials:'include'}).then(r=>r.json()).then(d=>Array.isArray(d)&&setCategories(d));
    if(!isNew) fetch(`/api/admin/products/${id}`,{credentials:'include'}).then(r=>r.json()).then(d=>{
      if(d) { setForm({ name:d.name||'',description:d.description||'',price:String(d.price||''),comparePrice:d.comparePrice?String(d.comparePrice):'',unit:d.unit||'kg',stock:String(d.stock||0),categoryId:d.categoryId||'',featured:d.featured||false,organic:d.organic||false,active:d.active!==false,tags:d.tags?.join(',')||'' }); setImages(d.images||[]); }
    });
  },[id,isNew]);

  const set = (k:string,v:any) => setForm(f=>({...f,[k]:v}));

  const uploadImg = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append('file',file); fd.append('folder','agrifusion/products');
    const res = await fetch('/api/admin/upload',{method:'POST',body:fd,credentials:'include'});
    const d   = await res.json();
    if(d.url){setImages(prev=>[...prev,d.url]);toast.success('Image uploaded!');}
    setUploading(false);
  };

  const save = async () => {
    if(!form.name.trim()) return toast.error('Name required');
    if(!form.categoryId) return toast.error('Select a category');
    setSaving(true);
    const payload = { ...form, price:parseFloat(form.price)||0, comparePrice:form.comparePrice?parseFloat(form.comparePrice):null, stock:parseInt(form.stock)||0, tags:form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean), images };
    const url  = isNew ? '/api/admin/products' : `/api/admin/products/${id}`;
    const meth = isNew ? 'POST' : 'PATCH';
    const res  = await fetch(url,{method:meth,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'include'});
    if(res.ok){toast.success(isNew?'Product created!':'Product saved!');if(isNew){const d=await res.json();router.push(`/admin/products/${d.id}`);}}
    else toast.error('Save failed.');
    setSaving(false);
  };

  const inp = 'inp';
  const UNITS = ['kg','bunch','piece','liter','500g','250g','tray','bag','sachet','box'];

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>router.back()} className="text-green-500 hover:text-green-700 text-sm">← Back</button>
        <h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100">{isNew?'New Product':'Edit Product'}</h1>
      </div>
      <div className="grid gap-5">
        {/* Basic info */}
        <div className="card rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100">Product Info</h2>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Name *</label><input className={inp} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Fresh Sukuma Wiki" /></div>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Description *</label><textarea className={inp} rows={4} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Describe the product, its origin, quality..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Category *</label>
              <select className={inp} value={form.categoryId} onChange={e=>set('categoryId',e.target.value)}>
                <option value="">Select category...</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Unit</label>
              <select className={inp} value={form.unit} onChange={e=>set('unit',e.target.value)}>
                {UNITS.map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100">Pricing & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Price (KES) *</label><input type="number" className={inp} value={form.price} onChange={e=>set('price',e.target.value)} placeholder="0" /></div>
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Compare Price</label><input type="number" className={inp} value={form.comparePrice} onChange={e=>set('comparePrice',e.target.value)} placeholder="0 (optional)" /></div>
            <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Stock</label><input type="number" className={inp} value={form.stock} onChange={e=>set('stock',e.target.value)} /></div>
          </div>
        </div>

        {/* Images */}
        <div className="card rounded-2xl p-6">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100 mb-4">Images</h2>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img,i)=>(
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-green-200">
                <Image src={img} alt={`Product ${i+1}`} width={80} height={80} className="w-full h-full object-cover" />
                <button onClick={()=>setImages(prev=>prev.filter((_,idx)=>idx!==i))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
              </div>
            ))}
            <label className={`w-20 h-20 border-2 border-dashed border-green-300 rounded-xl flex flex-col items-center justify-center text-green-500 cursor-pointer hover:border-green-500 transition-all ${uploading?'opacity-50':''}`}>
              <span className="text-xl">{uploading?'⏳':'+'}</span>
              <span className="text-[10px] mt-1">{uploading?'Uploading':'Add'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&uploadImg(e.target.files[0])} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Tags & flags */}
        <div className="card rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100">Tags & Flags</h2>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Tags (comma separated)</label><input className={inp} value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="fresh, organic, nairobi" /></div>
          <div className="flex gap-6">
            {[{k:'organic',l:'🌱 Certified Organic'},{k:'featured',l:'⭐ Featured Product'},{k:'active',l:'✅ Active (visible)'}].map(f=>(
              <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                <div onClick={()=>set(f.k,!(form as any)[f.k])} className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${(form as any)[f.k]?'bg-green-500':'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(form as any)[f.k]?'translate-x-4':''}`} />
                </div>
                <span className="text-sm text-green-800 dark:text-green-200">{f.l}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary py-4 text-base disabled:opacity-50">
          {saving?'Saving…':isNew?'Create Product →':'Save Changes →'}
        </button>
      </div>
    </div>
  );
}
