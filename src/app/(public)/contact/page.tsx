'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSettings } from '@/components/SettingsProvider';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactPage() {
  const settings = useSettings();
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/contact',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    if (res.ok) { toast.success("Message sent! We'll reply within 24 hours.", {icon:'🌿'}); setForm({name:'',email:'',phone:'',subject:'',message:''}); }
    else toast.error('Failed to send. Please email us directly.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <div className="bg-gradient-to-br from-green-900 to-green-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading font-black text-5xl text-white mb-4">Get in <span className="text-green-300">Touch</span></h1>
          <p className="text-green-200 text-lg">We'd love to hear from you. Whether it's a question, bulk order, or farm partnership.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h2 className="font-heading font-bold text-2xl text-green-900 dark:text-green-100 mb-6">Contact Information</h2>
              <div className="space-y-4 mb-8">
                {[
                  { icon:'✉️', l:'Email', v:settings.contact_email, href:`mailto:${settings.contact_email}` },
                  { icon:'📞', l:'Phone', v:settings.contact_phone, href:`tel:${settings.contact_phone}` },
                  { icon:'📍', l:'Address', v:settings.contact_address, href:'' },
                  { icon:'🕐', l:'Hours', v:settings.business_hours, href:'' },
                ].filter(c=>c.v).map(c=>(
                  <div key={c.l} className="card rounded-2xl p-4 flex gap-4 items-start card-hover">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">{c.icon}</div>
                    <div>
                      <div className="text-xs text-green-600 uppercase tracking-widest mb-0.5">{c.l}</div>
                      {c.href ? <a href={c.href} className="text-green-900 dark:text-green-100 font-medium text-sm hover:text-green-600 transition-colors">{c.v}</a>
                        : <span className="text-green-900 dark:text-green-100 font-medium text-sm">{c.v}</span>}
                    </div>
                  </div>
                ))}
              </div>
              {settings.social_whatsapp && (
                <a href={`https://wa.me/${settings.social_whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener" className="btn-primary w-full text-center">
                  💬 Chat on WhatsApp
                </a>
              )}
            </ScrollReveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <div className="card rounded-2xl p-8">
                <h2 className="font-heading font-bold text-xl text-green-900 dark:text-green-100 mb-6">Send a Message</h2>
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Name *</label>
                      <input required className="inp" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Jane Wanjiku" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Email *</label>
                      <input required type="email" className="inp" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="jane@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Phone</label>
                      <input className="inp" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+254 700 000 000" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Subject</label>
                      <select className="inp" value={form.subject} onChange={e=>set('subject',e.target.value)}>
                        <option value="">Select...</option>
                        {['General Inquiry','Bulk/Wholesale Order','Farm Partnership','Delivery Issue','Product Question','Other'].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Message *</label>
                    <textarea required rows={5} className="inp" value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Tell us how we can help..." />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                    {loading ? '⏳ Sending…' : 'Send Message →'}
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
