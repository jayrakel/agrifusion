'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCart } from './CartProvider';

export default function Nav({ settings }: { settings: Record<string,string> }) {
  const [stuck,    setStuck]    = useState(false);
  const [open,     setOpen]     = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const { theme, setTheme }     = useTheme();
  const pathname                = usePathname();
  const { count, toggleCart }   = useCart();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  const active = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  const links = [
    { href: '/',        label: 'Home'    },
    { href: '/shop',    label: 'Shop'    },
    { href: '/about',   label: 'About'   },
    { href: '/blog',    label: 'Blog'    },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 ${
        stuck ? 'bg-white/95 dark:bg-green-950/95 backdrop-blur-xl border-b border-green-100 dark:border-green-900 shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {settings.logo_url ? (
              <Image src={settings.logo_url} alt={settings.site_name} width={120} height={40} className="h-10 w-auto" />
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl grad-green flex items-center justify-center text-white font-heading font-black text-sm">AF</div>
                <div className="font-heading leading-tight">
                  <div className="font-black text-sm text-green-800 dark:text-green-100">Agrifusion</div>
                  <div className="text-[10px] font-bold text-green-600 dark:text-green-400 tracking-wide">Co.</div>
                </div>
              </>
            )}
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  active(l.href)
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-bold'
                    : 'text-green-800 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700'
                }`}>{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-9 h-9 rounded-lg border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all flex items-center justify-center text-sm">
              {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌙'}
            </button>

            {/* Cart */}
            <button onClick={toggleCart} className="relative w-9 h-9 rounded-lg border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all flex items-center justify-center">
              🛒
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 grad-green rounded-full text-white text-[10px] font-black flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Track order */}
            <Link href="/track" className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/30 transition-all">
              📦 Track Order
            </Link>

            {/* Mobile hamburger */}
            <button onClick={() => setOpen(!open)} className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-green-200 dark:border-green-800">
              <span className={`w-5 h-0.5 bg-green-700 dark:bg-green-400 rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-green-700 dark:bg-green-400 rounded transition-all ${open ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-green-700 dark:bg-green-400 rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-green-950 border-b border-green-100 dark:border-green-900 shadow-xl p-4">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${
                active(l.href) ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-bold' : 'text-green-800 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30'
              }`}>{l.label}</Link>
            ))}
            <Link href="/track" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 mt-2">📦 Track My Order</Link>
          </div>
        )}
      </nav>

      {open && <div className="fixed inset-0 z-[105] bg-black/20 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
