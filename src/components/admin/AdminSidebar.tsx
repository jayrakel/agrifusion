'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

const NAV = [
  { href:'/admin',              icon:'📊', label:'Dashboard'   },
  { href:'/admin/orders',       icon:'🛒', label:'Orders'      },
  { href:'/admin/products',     icon:'🥬', label:'Products'    },
  { href:'/admin/categories',   icon:'🗂️', label:'Categories'  },
  { href:'/admin/reviews',      icon:'⭐', label:'Reviews'     },
  { href:'/admin/messages',     icon:'💬', label:'Messages'    },
  { href:'/admin/blog',         icon:'📝', label:'Blog'        },
  { href:'/admin/subscribers',  icon:'📧', label:'Subscribers' },
  { href:'/admin/newsletter',   icon:'📨', label:'Newsletter'  },
  { href:'/admin/media',        icon:'🗃️', label:'Media'       },
  { href:'/admin/settings',     icon:'⚙️', label:'Settings'    },
  { href:'/admin/profile',      icon:'👤', label:'My Profile'  },
];

interface Props { user: { name?:string; email?:string }; logo?:string; siteName?:string; }

function LogoBadge({ logo, siteName }: { logo?:string; siteName?:string }) {
  if (logo) return (
    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-green-100">
      <Image src={logo} alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-lg grad-green flex items-center justify-center text-white font-heading font-black text-xs flex-shrink-0">
      {siteName ? siteName.slice(0,2).toUpperCase() : 'AF'}
    </div>
  );
}

export default function AdminSidebar({ user, logo, siteName }: Props) {
  const path   = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  const isActive = (href: string) => href === '/admin' ? path === href : path.startsWith(href);
  const handleSignOut = async () => {
    await signOut({ redirect:false });
    window.location.href = window.location.origin + '/admin/login';
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-green-950 border-b border-green-900 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2.5"><LogoBadge logo={logo} siteName={siteName} /><span className="font-heading font-bold text-sm text-white">Admin</span></div>
        <button onClick={() => setOpen(!open)} className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-green-900">
          <span className={`w-5 h-0.5 bg-green-300 rounded transition-all ${open?'rotate-45 translate-y-2':''}`}></span>
          <span className={`w-5 h-0.5 bg-green-300 rounded transition-all ${open?'opacity-0':''}`}></span>
          <span className={`w-5 h-0.5 bg-green-300 rounded transition-all ${open?'-rotate-45 -translate-y-2':''}`}></span>
        </button>
      </div>
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-green-950 border-r border-green-900 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
        <div className="p-5 border-b border-green-900 hidden md:flex items-center gap-2.5">
          <LogoBadge logo={logo} siteName={siteName} />
          <div><div className="font-heading font-black text-xs text-white leading-tight">{siteName || 'Agrifusion Co.'}</div><div className="text-green-500 text-[10px]">Admin Panel</div></div>
        </div>
        <div className="p-4 border-b border-green-900 md:hidden flex justify-between items-center">
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Menu</span>
          <button onClick={() => setOpen(false)} className="text-green-400 hover:text-white p-1">✕</button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(n.href)?'bg-green-500/15 text-green-400 border-l-2 border-green-400 pl-2.5':'text-green-500 hover:text-green-200 hover:bg-green-900/50'}`}>
              <span className="text-base w-5 text-center">{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-green-900">
          <div className="px-3 py-2 mb-1"><div className="text-xs font-medium text-white truncate">{user?.name}</div><div className="text-[10px] text-green-600 truncate">{user?.email}</div></div>
          <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-xs text-green-500 hover:text-green-300 rounded-lg hover:bg-green-900/50 transition-all">🌐 View Site</Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-500 hover:text-red-400 rounded-lg hover:bg-green-900/50 transition-all text-left">🚪 Sign Out</button>
        </div>
      </aside>
    </>
  );
}
