"use client";
import { signIn } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [settings, setSettings] = useState<Record<string,string>>({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/settings').then(r=>r.json()).then(setSettings).catch(()=>{});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const res = await signIn('credentials', { ...form, redirect:false });
    if (res?.ok) router.push('/admin');
    else { setError('Invalid email or password.'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4"
      style={{ backgroundImage:'linear-gradient(rgba(22,163,74,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(22,163,74,.04) 1px,transparent 1px)', backgroundSize:'60px 60px' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {settings.logo_url
            ? <img src={settings.logo_url} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />
            : <div className="w-14 h-14 mx-auto rounded-2xl grad-green flex items-center justify-center font-heading font-black text-white text-xl mb-4">AF</div>}
          <h1 className="font-heading font-black text-2xl text-white">Admin Login</h1>
          <p className="text-green-500 text-sm mt-1">{settings.site_name || 'Agrifusion Co.'}</p>
        </div>
        <div className="bg-green-900/50 border border-green-800 rounded-2xl p-8">
          {error && <div className="mb-4 p-3 bg-red-400/10 border border-red-400/30 rounded-xl text-red-400 text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-green-400 text-xs uppercase tracking-widest mb-2">Email</label>
              <input required type="email" className="w-full px-4 py-3 bg-green-950 border border-green-800 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 transition-all" placeholder="admin@agrifusion.co.ke" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div>
              <label className="block text-green-400 text-xs uppercase tracking-widest mb-2">Password</label>
              <input required type="password" className="w-full px-4 py-3 bg-green-950 border border-green-800 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 transition-all" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen bg-green-950 flex items-center justify-center"><div className="text-green-500 animate-pulse">Loading…</div></div>}><LoginForm /></Suspense>;
}
