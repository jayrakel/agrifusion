import Link from 'next/link';
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, featured, posts] = await Promise.all([
    getSettings(),
    prisma.category.findMany({ where:{ active:true, featured:true }, orderBy:{ order:'asc' } }),
    prisma.product.findMany({ where:{ active:true, featured:true }, include:{ category:true }, orderBy:{ order:'asc' }, take:8 }),
    prisma.post.findMany({ where:{ published:true }, orderBy:{ publishedAt:'desc' }, take:3 }),
  ]);

  const stats = [
    { val: settings.stat_products  || '500+',    lbl: 'Products',        icon: '🥬' },
    { val: settings.stat_customers || '10,000+', lbl: 'Happy Customers', icon: '😊' },
    { val: settings.stat_farms     || '50+',     lbl: 'Partner Farms',   icon: '🌾' },
    { val: settings.stat_cities    || '5',        lbl: 'Cities Served',   icon: '🏙️' },
  ];

  const whyUs = [
    { icon:'🌱', title:'Direct from Farm', desc:'We source directly from over 50 Kenyan farms, guaranteeing freshness and cutting out costly middlemen.' },
    { icon:'🚚', title:'Same-Day Delivery', desc:'Order before noon and receive your fresh produce the same day across Nairobi and select counties.' },
    { icon:'✅', title:'Quality Guaranteed', desc:'Every product is quality-checked before dispatch. Not satisfied? We offer a full refund or replacement.' },
    { icon:'🌿', title:'Supports Local Farmers', desc:"Buying from Agrifusion means fair pay for Kenya's hardworking farmers. We're proud to be their partner." },
  ];

  const testimonials = [
    { name:'Sarah Wanjiku',    role:'Home Chef, Westlands',   text:'The freshness of the vegetables is unmatched. Sukuma wiki and tomatoes arrive like they were just picked!', avatar:'SW' },
    { name:'James Omondi',     role:'Restaurant Owner, CBD',  text:'Agrifusion has transformed our supply chain. Reliable, fresh, and the M-Pesa payments make it super easy.',  avatar:'JO' },
    { name:'Grace Kamau',      role:'Farm Manager, Kiambu',   text:'As a farmer, I love that Agrifusion gives us fair prices and connects us directly with Nairobi buyers.',      avatar:'GK' },
  ];

  const heroLines = (settings.hero_title || 'Rooted in Quality.\nGrown for Everyone.').split('\n');

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800">
        {/* Background video */}
        {settings.hero_video && (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" src={settings.hero_video} />
        )}
        {/* Dark overlay for readability */}
        {settings.hero_video && <div className="absolute inset-0 bg-black/40 z-[1]" />}
        {/* Background pattern (fallback if no video) */}
        {!settings.hero_video && (
          <>
            <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage:'radial-gradient(circle at 20% 50%, #22C55E 0%, transparent 60%), radial-gradient(circle at 80% 20%, #84CC16 0%, transparent 50%)' }} />
            <div className="absolute inset-0 z-0" style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
          </>
        )}

        {/* Decorative circles */}
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-lime-400/8 rounded-full blur-3xl animate-float [animation-delay:-4s] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/30 bg-green-400/10 text-green-300 text-xs font-heading font-bold tracking-widest uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot"></span>
                {settings.location_emoji} &nbsp;{settings.location_name}'s Freshest Marketplace
              </div>
              <h1 className="font-heading font-black text-5xl lg:text-6xl leading-[1.07] text-white mb-6">
                {heroLines.map((line, i) => (
                  <span key={i} className={i === 0 ? 'block' : 'block grad-text'}>{line}</span>
                ))}
              </h1>
              <p className="text-green-200 text-lg leading-relaxed mb-10 max-w-xl">
                {settings.hero_subtitle}
              </p>
              <div className="flex flex-wrap gap-4 mb-14">
                <Link href="/shop" className="btn-primary text-base px-8 py-4">
                  Shop Fresh Now →
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-green-400/30 text-green-200 font-heading font-bold text-base hover:bg-green-400/10 transition-all">
                  Our Story
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 pt-8 border-t border-green-800">
                {['🌱 Farm Direct', '🚚 Same-Day Delivery', '✅ Quality Guaranteed', '🔒 Secure Checkout'].map(b => (
                  <span key={b} className="text-green-300 text-xs font-medium">{b}</span>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden border border-green-700/50 shadow-2xl shadow-green-900/50">
                {settings.hero_image ? (
                  <Image src={settings.hero_image} alt="Fresh farm produce" width={600} height={500} className="w-full h-[500px] object-cover" />
                ) : (
                  <div className="w-full h-[500px] bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🥬</div>
                      <p className="text-green-400 font-heading font-bold">Upload hero image<br/>in Admin → Settings</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Floating cards */}
              {[
                { pos:'top-8 -left-10',   icon:'🌾', lbl:'Partner Farms',  val:settings.stat_farms || '50+',     bg:'bg-amber-500', delay:'' },
                { pos:'bottom-24 -right-8', icon:'🚚', lbl:'On-Time Delivery',val:'99%',                              bg:'bg-green-500', delay:'[animation-delay:-3s]' },
                { pos:'top-1/2 -left-12 -translate-y-1/2', icon:'⭐', lbl:'Rating',        val:'4.9/5',                              bg:'bg-lime-500', delay:'[animation-delay:-1.5s]' },
              ].map(b => (
                <div key={b.lbl} className={`absolute ${b.pos} flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl animate-float ${b.delay}`}>
                  <div className={`w-9 h-9 rounded-xl ${b.bg} flex items-center justify-center text-white text-base`}>{b.icon}</div>
                  <div>
                    <div className="text-white/60 text-[10px] uppercase tracking-widest">{b.lbl}</div>
                    <div className="font-heading font-black text-sm text-white">{b.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-12 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <ScrollReveal key={s.lbl} delay={i * 80} className="card rounded-2xl py-8 px-6 text-center card-hover">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-heading font-black text-3xl grad-text mb-1">{s.val}</div>
                <div className="text-green-600 dark:text-green-400 text-xs uppercase tracking-wider">{s.lbl}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div className="border-y border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-900/20 py-4 overflow-hidden">
        <div className="flex gap-12 animate-marquee w-max">
          {['🥬 Fresh Vegetables','🥛 Farm Dairy','🌱 Quality Seeds','🥩 Livestock Products','🍅 Organic Tomatoes','🥑 Hass Avocado','🌾 Certified Seeds','🍯 Raw Honey',
            '🥬 Fresh Vegetables','🥛 Farm Dairy','🌱 Quality Seeds','🥩 Livestock Products','🍅 Organic Tomatoes','🥑 Hass Avocado','🌾 Certified Seeds','🍯 Raw Honey',
          ].map((t, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap font-heading text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot"></span>Browse Categories
            </span>
            <h2 className="font-heading font-black text-4xl lg:text-5xl mb-4">
              Shop by <span className="grad-text">Category</span>
            </h2>
            <p className="text-[var(--text-3)] max-w-xl mx-auto">From fresh produce to quality farm inputs — everything you need in one place.</p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 60}>
                <Link href={`/shop?category=${cat.slug}`} className="group card card-hover rounded-2xl p-6 text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {cat.image ? <Image src={cat.image} alt={cat.name} width={48} height={48} className="w-full h-full object-cover rounded-xl" /> : cat.icon}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs text-green-900 dark:text-green-100 leading-tight">{cat.name}</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="py-24 bg-green-50/50 dark:bg-green-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot"></span>Fresh Picks
              </span>
              <h2 className="font-heading font-black text-4xl">Featured <span className="grad-text">Products</span></h2>
            </ScrollReveal>
            <Link href="/shop" className="btn-outline text-sm">View All Products →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p, i) => (
              <ScrollReveal key={p.id} delay={i % 4 * 80}>
                <ProductCard p={p} />
              </ScrollReveal>
            ))}
          </div>
          {featured.length === 0 && (
            <div className="text-center py-16 text-green-500">No featured products yet. Add some in the admin panel.</div>
          )}
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <h2 className="font-heading font-black text-4xl mb-4">Why <span className="grad-text">Agrifusion?</span></h2>
            <p className="text-[var(--text-3)] max-w-xl mx-auto">We're not just an online store. We're a movement to make fresh, quality food accessible to every Kenyan.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w, i) => (
              <ScrollReveal key={w.title} delay={i * 80} className="card card-hover rounded-2xl p-7">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl mb-5">{w.icon}</div>
                <h3 className="font-heading font-bold text-base mb-2 text-green-900 dark:text-green-100">{w.title}</h3>
                <p className="text-[var(--text-3)] text-sm leading-relaxed">{w.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER ────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle at 80% 50%, #84CC16 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <div className="text-4xl mb-4">🚚</div>
            <h2 className="font-heading font-black text-3xl lg:text-4xl text-white mb-4">
              Free Delivery on Orders Over KES {parseInt(settings.free_delivery_min || '2000').toLocaleString()}
            </h2>
            <p className="text-green-100 mb-8 max-w-lg mx-auto">Order before noon for same-day delivery across Nairobi. Fresh from the farm to your door.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-heading font-black rounded-xl hover:bg-green-50 transition-all text-sm shadow-lg">
              Start Shopping → 
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <h2 className="font-heading font-black text-4xl mb-4">What Our <span className="grad-text">Customers Say</span></h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 80} className="card card-hover rounded-2xl p-7">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}</div>
                <p className="text-[var(--text-3)] text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full grad-green flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div>
                    <div className="font-heading font-bold text-sm text-green-900 dark:text-green-100">{t.name}</div>
                    <div className="text-green-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ──────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-24 bg-green-50/50 dark:bg-green-950/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
              <ScrollReveal>
                <h2 className="font-heading font-black text-4xl">From Our <span className="grad-text">Farm Blog</span></h2>
              </ScrollReveal>
              <Link href="/blog" className="btn-outline text-sm">All Articles →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 80}>
                  <Link href={`/blog/${post.slug}`} className="group block card card-hover rounded-2xl overflow-hidden">
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} width={600} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-48 bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-4xl">🌾</div>
                    )}
                    <div className="p-6">
                      <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full">{post.category}</span>
                      <h3 className="font-heading font-bold text-base mt-3 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug">{post.title}</h3>
                      <p className="text-[var(--text-3)] text-sm line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="card rounded-3xl p-14">
              <div className="text-5xl mb-6">🌿</div>
              <h2 className="font-heading font-black text-4xl lg:text-5xl mb-5">
                Ready to Eat <span className="grad-text">Fresh?</span>
              </h2>
              <p className="text-[var(--text-3)] text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                Join over {settings.stat_customers || '10,000+'} Kenyans who trust Agrifusion for their daily fresh produce. Start your order today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/shop" className="btn-primary text-base px-10 py-4">Shop Now →</Link>
                <Link href="/contact" className="btn-outline text-base px-10 py-4">Talk to Us</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
