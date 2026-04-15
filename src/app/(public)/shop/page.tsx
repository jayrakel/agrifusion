import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
export const revalidate = 60;

export default async function ShopPage({ searchParams }: { searchParams: { category?:string; search?:string; sort?:string; organic?:string } }) {
  const { category, search, sort='newest', organic } = searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where:{ active:true }, orderBy:{ order:'asc' } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(category && { category: { slug: category } }),
        ...(organic === '1' && { organic: true }),
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      include: { category: true },
      orderBy: sort === 'price-asc' ? { price:'asc' } : sort === 'price-desc' ? { price:'desc' } : { createdAt:'desc' },
    }),
  ]);

  const activeCategory = categories.find(c => c.slug === category);

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white font-medium">Shop</span>
            {activeCategory && <><span>›</span><span className="text-white font-medium">{activeCategory.name}</span></>}
          </div>
          <h1 className="font-heading font-black text-4xl text-white mb-2">
            {activeCategory ? activeCategory.name : search ? `Search: "${search}"` : 'All Products'}
          </h1>
          <p className="text-green-200">{products.length} products available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="card rounded-2xl p-5 sticky top-24">
              <h3 className="font-heading font-bold text-sm text-green-900 dark:text-green-100 mb-4">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/shop" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${!category ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-bold' : 'text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'}`}>
                    <span>🌿</span> All Products
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/shop?category=${cat.slug}${organic==='1'?'&organic=1':''}`} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${category===cat.slug ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-bold' : 'text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'}`}>
                      <span>{cat.icon}</span> {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-green-100 dark:border-green-900">
                <h3 className="font-heading font-bold text-sm text-green-900 dark:text-green-100 mb-3">Filter</h3>
                <Link href={`/shop?${category?`category=${category}&`:''}organic=${organic==='1'?'0':'1'}`} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${organic==='1' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 font-bold' : 'text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'}`}>
                  <span className="badge-organic">🌱 Organic</span>
                  {organic==='1' && <span className="text-green-500 text-xs ml-auto">✓</span>}
                </Link>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Search & sort bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <form className="flex-1 flex gap-2">
                <input name="search" defaultValue={search} placeholder="Search products..." className="inp flex-1" />
                {category && <input type="hidden" name="category" value={category} />}
                <button type="submit" className="btn-primary px-5 py-3">🔍</button>
              </form>
              <div className="flex gap-2">
                {[['newest','Newest'],['price-asc','Price ↑'],['price-desc','Price ↓']].map(([v,l]) => (
                  <Link key={v} href={`/shop?${category?`category=${category}&`:''}${search?`search=${search}&`:''}sort=${v}${organic==='1'?'&organic=1':''}`}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${sort===v ? 'grad-green text-white' : 'card text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'}`}>
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile categories */}
            <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
              <Link href="/shop" className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${!category ? 'grad-green text-white' : 'card text-green-700'}`}>All</Link>
              {categories.map(cat => (
                <Link key={cat.id} href={`/shop?category=${cat.slug}`} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${category===cat.slug ? 'grad-green text-white' : 'card text-green-700'}`}>
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🌾</div>
                <p className="text-green-700 dark:text-green-400 font-medium">No products found</p>
                <Link href="/shop" className="btn-primary mt-6 text-sm">Clear Filters</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p, i) => (
                  <ScrollReveal key={p.id} delay={i % 3 * 80}>
                    <ProductCard p={p} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
