"use client";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
export default function SettingsAdmin() {
  const [s, setS]       = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [tab, setTab]   = useState('brand');
  useEffect(()=>{ fetch('/api/admin/settings',{credentials:'include'}).then(r=>r.json()).then(setS); },[]);
  const set = (k:string,v:string) => setS(p=>({...p,[k]:v}));
  const upload = async (file:File, key:string, folder:string) => {
    setUploading(key);
    const fd = new FormData(); fd.append('file',file); fd.append('folder',`agrifusion/${folder}`);
    const res = await fetch('/api/admin/upload',{method:'POST',body:fd,credentials:'include'});
    const d   = await res.json();
    if(d.url){set(key,d.url);toast.success('Uploaded! Save settings to apply.');}
    setUploading('');
  };
  const save = async (keys:string[]) => {
    setSaving(true);
    const patch: Record<string,string> = {};
    keys.forEach(k=>{patch[k]=s[k]||'';});
    await fetch('/api/admin/settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch),credentials:'include'});
    toast.success('Settings saved!');
    setSaving(false);
  };
  const inp = 'inp';
  const tabs = [{id:'brand',l:'🏷️ Brand'},{id:'contact',l:'📞 Contact'},{id:'social',l:'🌐 Social'},{id:'delivery',l:'🚚 Delivery'},{id:'hero',l:'🏡 Hero'},{id:'location',l:'📍 Location'},{id:'stats',l:'📊 Stats'}];
  const groups: Record<string,{key:string;label:string;type?:string;opts?:string[]}[]> = {
    brand:[{key:'site_name',label:'Site Name'},{key:'site_tagline',label:'Tagline'},{key:'site_description',label:'Description'},{key:'logo_url',label:'Logo URL (upload below)'},{key:'favicon_url',label:'Favicon URL'}],
    contact:[{key:'contact_email',label:'Email',type:'email'},{key:'contact_phone',label:'Phone'},{key:'contact_address',label:'Address'},{key:'business_hours',label:'Business Hours'},{key:'notify_email',label:'Admin Notification Email',type:'email'}],
    social:[{key:'social_facebook',label:'Facebook URL'},{key:'social_instagram',label:'Instagram URL'},{key:'social_twitter',label:'X / Twitter URL'},{key:'social_whatsapp',label:'WhatsApp Number (with country code)'}],
    delivery:[{key:'delivery_fee',label:'Delivery Fee (KES)'},{key:'free_delivery_min',label:'Free Delivery Min Order (KES)'},{key:'mpesa_paybill',label:'M-Pesa Paybill / Till Number'}],
    hero:[{key:'hero_title',label:'Hero Title'},{key:'hero_subtitle',label:'Hero Subtitle'},{key:'hero_image',label:'Hero Image URL (upload below)'},{key:'hero_video',label:'Hero Video URL (background video - upload below)'}],
    location:[{key:'location_emoji',label:'Location Emoji'},{key:'location_name',label:'Location Name (e.g., Nairobi\'s Freshest Marketplace)'}],
    stats:[{key:'stat_products',label:'Products Count'},{key:'stat_customers',label:'Customers Count'},{key:'stat_farms',label:'Partner Farms Count'},{key:'stat_cities',label:'Cities Served'}],
  };
  const currentGroup = groups[tab]||[];
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100 mb-1">Site Settings</h1>
      <p className="text-green-500 text-sm mb-6">Changes apply to the live site after saving.</p>
      <div className="flex gap-1 flex-wrap mb-6 border-b border-green-100 dark:border-green-900 pb-4">
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab===t.id?'grad-green text-white':'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'}`}>{t.l}</button>)}
      </div>
      <div className="space-y-4 mb-6">
        {currentGroup.map(f=>(
          <div key={f.key}>
            <label className="block text-xs text-green-600 uppercase tracking-widest mb-2">{f.label}</label>
            {f.key.includes('subtitle')||f.key.includes('description')||f.key==='hero_title'
              ? <textarea className={inp} rows={3} value={s[f.key]||''} onChange={e=>set(f.key,e.target.value)}/>
              : <input type={f.type||'text'} className={inp} value={s[f.key]||''} onChange={e=>set(f.key,e.target.value)}/>}
          </div>
        ))}
      </div>
      {/* Upload helpers */}
      {tab==='brand'&&(
        <div className="card rounded-2xl p-5 mb-5 space-y-4">
          <h3 className="font-heading font-bold text-sm text-green-900 dark:text-green-100">Upload Files</h3>
          {[{key:'logo_url',label:'Logo',folder:'logos'},{key:'favicon_url',label:'Favicon',folder:'favicon'}].map(u=>(
            <div key={u.key}>
              <p className="text-xs text-green-500 mb-2">{u.label}</p>
              <input type="file" accept="image/*" className="hidden" id={u.key} onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],u.key,u.folder)}/>
              <label htmlFor={u.key} className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-green-300 dark:border-green-700 rounded-xl text-sm text-green-500 hover:border-green-500 cursor-pointer transition-all ${uploading===u.key?'opacity-50':''}`}>{uploading===u.key?'Uploading…':'📤 Upload'}</label>
              {s[u.key]&&<img src={s[u.key]} alt={u.label} className="h-10 mt-2 object-contain"/>}
            </div>
          ))}
        </div>
      )}
      {tab==='hero'&&(
        <div className="card rounded-2xl p-5 mb-5 space-y-4">
          <div>
            <p className="text-xs text-green-500 mb-2">Hero Image</p>
            <input type="file" accept="image/*" className="hidden" id="hero-img" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],'hero_image','hero')}/>
            <label htmlFor="hero-img" className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-green-300 rounded-xl text-sm text-green-500 hover:border-green-500 cursor-pointer transition-all ${uploading==='hero_image'?'opacity-50':''}`}>{uploading==='hero_image'?'Uploading…':'📤 Upload Hero Image'}</label>
            {s.hero_image&&<img src={s.hero_image} alt="Hero" className="w-full h-32 object-cover rounded-xl mt-3"/>}
          </div>
          <div>
            <p className="text-xs text-green-500 mb-2">Hero Background Video (MP4, WebM recommended)</p>
            <input type="file" accept="video/*" className="hidden" id="hero-video" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],'hero_video','hero')}/>
            <label htmlFor="hero-video" className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-green-300 rounded-xl text-sm text-green-500 hover:border-green-500 cursor-pointer transition-all ${uploading==='hero_video'?'opacity-50':''}`}>{uploading==='hero_video'?'Uploading…':'🎬 Upload Background Video'}</label>
            {s.hero_video&&<video src={s.hero_video} controls className="w-full h-32 object-cover rounded-xl mt-3"/>}
          </div>
        </div>
      )}
      <button onClick={()=>save(currentGroup.map(f=>f.key))} disabled={saving} className="btn-primary py-3.5 disabled:opacity-50">
        {saving?'Saving…':'Save Settings'}
      </button>
    </div>
  );
}
