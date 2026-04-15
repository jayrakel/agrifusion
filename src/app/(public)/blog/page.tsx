import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
export const revalidate = 60;
export default async function BlogPage() {
  const posts = await prisma.post.findMany({ where:{ published:true }, orderBy:{ publishedAt:'desc' } });
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured || p.id !== featured?.id);
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <div className="bg-gradient-to-br from-green-900 to-green-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading font-black text-5xl text-white mb-4">Farm <span className="text-green-300">Blog</span></h1>
          <p className="text-green-200 text-lg">Farming tips, seasonal guides, and agricultural news from Kenya.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {featured && (
          <ScrollReveal className="mb-14">
            <Link href={"/blog/"+featured.slug} className="group grid lg:grid-cols-2 gap-0 card overflow-hidden rounded-3xl card-hover">
              {featured.coverImage ? <Image src={featured.coverImage} alt={featured.title} width={800} height={400} className="w-full h-72 lg:h-auto object-cover group-hover:scale-105 transition-transform duration-500"/>
                : <div className="w-full h-72 bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-6xl">🌾</div>}
              <div className="p-10 flex flex-col justify-center">
                <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-green-600 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full w-fit mb-4">{featured.category}</span>
                <h2 className="font-heading font-black text-2xl mb-3 text-green-900 dark:text-green-100 group-hover:text-green-600 transition-colors">{featured.title}</h2>
                <p className="text-[var(--text-3)] leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="text-green-600 font-heading font-bold text-sm">Read Article →</span>
              </div>
            </Link>
          </ScrollReveal>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post,i) => (
            <ScrollReveal key={post.id} delay={i%3*80}>
              <Link href={"/blog/"+post.slug} className="group block card card-hover rounded-2xl overflow-hidden">
                {post.coverImage ? <Image src={post.coverImage} alt={post.title} width={600} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"/>
                  : <div className="w-full h-48 bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-4xl">🌾</div>}
                <div className="p-6">
                  <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-green-600 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full">{post.category}</span>
                  <h3 className="font-heading font-bold text-base mt-3 mb-2 text-green-900 dark:text-green-100 group-hover:text-green-600 transition-colors leading-snug">{post.title}</h3>
                  <p className="text-[var(--text-3)] text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        {posts.length===0&&<div className="text-center py-20 text-green-500">No blog posts yet.</div>}
      </div>
    </div>
  );
}
