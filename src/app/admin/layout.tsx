import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: { default:'Admin', template:'%s | Admin — Agrifusion' } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) return <>{children}</>;
  const [user, settings] = await Promise.all([
    prisma.user.findUnique({ where:{ id:(session.user as any).id }, select:{ mustChangePassword:true } }),
    getSettings(),
  ]);
  return (
    <div className="flex min-h-screen bg-green-950">
      <AdminSidebar user={session.user as any} logo={settings.logo_url || undefined} siteName={settings.site_name || 'Agrifusion Co.'} />
      <main className="flex-1 overflow-auto pt-16 md:pt-0 bg-gray-50 dark:bg-green-950/50">
        {user?.mustChangePassword && (
          <div className="bg-amber-400/10 border-b border-amber-400/30 px-8 py-3 flex items-center gap-3">
            <span className="text-amber-400">⚠️</span>
            <p className="text-amber-700 dark:text-amber-300 text-sm"><strong>Security notice:</strong> You are using the default password. <a href="/admin/profile" className="underline ml-1 font-bold">Change it now →</a></p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
