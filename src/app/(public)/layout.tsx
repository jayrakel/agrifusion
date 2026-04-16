import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { SettingsProvider } from '@/components/SettingsProvider';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <SettingsProvider settings={settings}>
      <Nav settings={settings} />
      <main className="pt-20">{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
    </SettingsProvider>
  );
}
