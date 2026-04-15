import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/CartProvider';
import { Toaster } from 'react-hot-toast';
import { getSettings } from '@/lib/settings';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets:['latin'], variable:'--font-heading', display:'swap' });
const inter   = Inter({ subsets:['latin'], variable:'--font-body', display:'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title:       { default: s.site_name || 'Agrifusion Co.', template: `%s | ${s.site_name || 'Agrifusion Co.'}` },
    description: s.site_description || "Nairobi's freshest agricultural marketplace.",
    icons:       { icon: s.favicon_url || '/favicon.svg', apple: s.favicon_url || '/favicon.svg' },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" />
      </head>
      <body className="font-body bg-[var(--bg)] text-[var(--text-1)] transition-colors duration-300">
        <ThemeProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ style: { background:'#fff', color:'#14532D', border:'1px solid #D1FAE5' } }} />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
