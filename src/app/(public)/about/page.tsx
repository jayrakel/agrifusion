// src/app/(public)/about/page.tsx
import { getSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import Image from 'next/image';
export const revalidate = 60;

export default async function AboutPage() {
  const [s, team] = await Promise.all([getSettings(), prisma.teamMember?.findMany({ where:{ active:true }, orderBy:{ order:'asc' }, take:6 }).catch(() => [])]);
  const values = [
    { icon:'🌱', t:'Farm Direct',       d:'We partner directly with 50+ Kenyan farms, ensuring maximum freshness and fair prices for farmers.' },
    { icon:'✅', t:'Quality Checked',   d:'Every product is inspected before dispatch. We reject anything that doesn\'t meet our high standards.' },
    { icon:'🚚', t:'Fast Delivery',     d:'Same-day delivery in Nairobi for orders placed before noon. Fresh from farm to your table in hours.' },
    { icon:'🤝', t:'Community First',   d:'We believe in building a sustainable food ecosystem that benefits farmers, consumers and the environment.' },
  ];
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-900 to-green-700 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle at 70% 50%,#84CC16 0%,transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/30 bg-green-400/10 text-green-300 text-xs font-heading font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot"></span>Our Story
          </span>
          <h1 className="font-heading font-black text-5xl text-white mb-5">We're Changing How <span className="text-green-300">Kenya Eats</span></h1>
          <p className="text-green-200 text-lg leading-relaxed max-w-2xl mx-auto">{s.about_story}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-16 items-center py-24">
          <ScrollReveal>
            <h2 className="font-heading font-black text-4xl mb-5 text-green-900 dark:text-green-100">Connecting Farms <span className="grad-text">to Tables</span></h2>
            <p className="text-[var(--text-3)] leading-relaxed mb-5">{s.about_story}</p>
            <p className="text-[var(--text-3)] leading-relaxed mb-8">{s.about_story2}</p>
            <div className="grid grid-cols-2 gap-4">
              {[{v:s.stat_products||'500+',l:'Products'},{v:s.stat_customers||'10,000+',l:'Customers'},{v:s.stat_farms||'50+',l:'Partner Farms'},{v:s.stat_cities||'5',l:'Cities'}].map(st=>(
                <div key={st.l} className="card rounded-2xl py-5 px-6 text-center">
                  <div className="font-heading font-black text-2xl grad-text">{st.v}</div>
                  <div className="text-green-600 text-xs uppercase tracking-wider mt-1">{st.l}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100} className="card rounded-3xl overflow-hidden">
            {s.hero_image ? <Image src={s.hero_image} alt="Our farm" width={600} height={500} className="w-full h-96 object-cover" />
              : <div className="w-full h-96 bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-8xl">🌾</div>}
          </ScrollReveal>
        </div>

        {/* Values */}
        <div className="mb-24">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-heading font-black text-4xl text-green-900 dark:text-green-100">Our <span className="grad-text">Values</span></h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v,i)=>(
              <ScrollReveal key={v.t} delay={i*80} className="card card-hover rounded-2xl p-7">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl mb-5">{v.icon}</div>
                <h3 className="font-heading font-bold text-base mb-2 text-green-900 dark:text-green-100">{v.t}</h3>
                <p className="text-[var(--text-3)] text-sm leading-relaxed">{v.d}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Team */}
        {Array.isArray(team) && team.length > 0 && (
          <div className="mb-24">
            <ScrollReveal className="text-center mb-12">
              <h2 className="font-heading font-black text-4xl text-green-900 dark:text-green-100">Meet the <span className="grad-text">Team</span></h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((m:any,i:number)=>(
                <ScrollReveal key={m.id} delay={i*80} className="card card-hover rounded-2xl overflow-hidden text-center p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-green-100">
                    {m.image ? <Image src={m.image} alt={m.name} width={96} height={96} className="w-full h-full object-cover object-center" /> : <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>}
                  </div>
                  <div className="font-heading font-bold text-green-900 dark:text-green-100">{m.name}</div>
                  <div className="text-green-600 text-sm mt-0.5">{m.role}</div>
                  {m.bio && <p className="text-[var(--text-3)] text-xs mt-2 line-clamp-3">{m.bio}</p>}
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal className="card rounded-3xl p-12 text-center mb-12">
          <h2 className="font-heading font-black text-3xl mb-4 text-green-900 dark:text-green-100">Ready to Shop <span className="grad-text">Fresh?</span></h2>
          <p className="text-[var(--text-3)] mb-8 max-w-md mx-auto">Join thousands of Kenyans who trust Agrifusion for fresh, quality agricultural products.</p>
          <Link href="/shop" className="btn-primary text-base px-10 py-4">Browse Our Shop →</Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
