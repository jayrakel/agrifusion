'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Footer({ settings }: { settings: Record<string,string> }) {
  const [email, setEmail] = useState('');
  const [name,  setName]  = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!email.includes('@')) return toast.error('Enter a valid email');
    setLoading(true);
    const res = await fetch('/api/subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, name }) });
    const d   = await res.json();
    if (res.ok) { toast.success(d.message || 'Check your email!', { icon:'🌿' }); setEmail(''); setName(''); }
    else toast.error(d.error || 'Something went wrong');
    setLoading(false);
  };

  const social = [
    { key:'social_facebook',  icon:'fab fa-facebook-f', label:'Facebook'  },
    { key:'social_instagram', icon:'fab fa-instagram',  label:'Instagram'  },
    { key:'social_twitter',   icon:'fab fa-x-twitter',  label:'X'          },
    { key:'social_whatsapp',  icon:'fab fa-whatsapp',   label:'WhatsApp',  href: (v: string) => `https://wa.me/${v.replace(/\D/g,'')}` },
  ].filter(s => settings[s.key]);

  return (
    <footer className="bg-green-950 border-t border-green-900 pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              {settings.logo_url ? (
                <Image src={settings.logo_url} alt={settings.site_name || 'Agrifusion'} width={120} height={40} className="h-10 w-auto" />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-xl grad-green flex items-center justify-center text-white font-heading font-black text-sm">AF</div>
                  <div className="font-heading"><div className="font-black text-sm text-white">Agrifusion</div><div className="text-[10px] text-green-400 font-bold">Co.</div></div>
                </>
              )}
            </Link>
            <p className="text-green-400 text-sm leading-relaxed mb-5">{settings.site_tagline || 'Rooted in Quality. Grown for Everyone.'}</p>
            {social.length > 0 && (
              <div className="flex gap-2">
                {social.map(s => (
                  <a key={s.key} href={s.href ? s.href(settings[s.key]) : settings[s.key]} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-green-800 bg-green-900 flex items-center justify-center text-green-400 hover:border-green-500 hover:text-green-300 transition-all text-xs" aria-label={s.label}>
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-widest text-white uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href:'/shop',    label:'Shop All Products' },
                { href:'/about',   label:'About Us'          },
                { href:'/blog',    label:'Farm Blog'         },
                { href:'/contact', label:'Contact'           },
                { href:'/track',   label:'Track My Order'    },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-green-400 text-sm hover:text-green-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-green-700 group-hover:bg-green-400 transition-colors flex-shrink-0"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-widest text-white uppercase mb-5">Contact</h4>
            <div className="space-y-3">
              {settings.contact_email && (
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 mt-0.5">✉</span>
                  <a href={`mailto:${settings.contact_email}`} className="text-green-400 hover:text-green-200 transition-colors break-all">{settings.contact_email}</a>
                </div>
              )}
              {settings.contact_phone && (
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 mt-0.5">📞</span>
                  <a href={`tel:${settings.contact_phone}`} className="text-green-400 hover:text-green-200 transition-colors">{settings.contact_phone}</a>
                </div>
              )}
              {settings.contact_address && (
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 mt-0.5">📍</span>
                  <span className="text-green-400">{settings.contact_address}</span>
                </div>
              )}
              {settings.business_hours && (
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 mt-0.5">🕐</span>
                  <span className="text-green-400">{settings.business_hours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-widest text-white uppercase mb-2">Newsletter</h4>
            <p className="text-green-400 text-xs mb-4">Fresh deals, seasonal offers and farm news — straight to your inbox.</p>
            <div className="space-y-2">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" className="w-full px-3 py-2.5 bg-green-900 border border-green-800 rounded-lg text-sm text-white placeholder:text-green-600 focus:outline-none focus:border-green-500 transition-all" />
              <div className="flex">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter'&&subscribe()} placeholder="your@email.com" className="flex-1 px-3 py-2.5 bg-green-900 border border-green-800 rounded-l-lg text-sm text-white placeholder:text-green-600 focus:outline-none focus:border-green-500 transition-all min-w-0" />
                <button onClick={subscribe} disabled={loading} className="px-4 grad-green text-white font-heading text-xs font-bold rounded-r-lg hover:opacity-90 transition-all disabled:opacity-50">
                  {loading ? '…' : '→'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-green-900 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-green-600 text-xs">© {new Date().getFullYear()} {settings.site_name || 'Agrifusion Co.'}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-green-600 text-xs hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="text-green-600 text-xs hover:text-green-400 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
