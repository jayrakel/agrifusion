'use client';
import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import toast from 'react-hot-toast';

// We use a client component so we can handle add to cart
// Data is fetched from the public API
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(r => r.json()).then(d => {
      if (d.error) return;
      setProduct(d.product);
      setRelated(d.related || []);
      setLoading(false);
    });
  }, [slug]);

  const handleAdd = () => {
    if (!product || product.stock === 0) return;
    setAdding(true);
    addItem({ id:product.id, name:product.name, slug:product.slug, price:product.price, unit:product.unit, image:product.images[0]||'', stock:product.stock }, qty);
    toast.success(`${qty}× ${product.name} added to cart!`, { icon:'🌿' });
    setTimeout(() => setAdding(false), 600);
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4 animate-bounce">🌿</div><p className="text-green-600">Loading...</p></div>
    </div>
  );
  if (!product) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-center px-6">
      <div><div className="text-5xl mb-4">😔</div><h2 className="font-heading font-black text-2xl mb-2">Product not found</h2><Link href="/shop" className="btn-primary mt-4">Back to Shop</Link></div>
    </div>
  );

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const images   = product.images?.length ? product.images : [null];

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Breadcrumb */}
      <div className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-green-700 transition-colors">Shop</Link>
          {product.category && <><span>›</span><Link href={`/shop?category=${product.category.slug}`} className="hover:text-green-700 transition-colors">{product.category.name}</Link></>}
          <span>›</span>
          <span className="text-green-900 dark:text-green-200 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Images */}
          <div>
            <div className="card rounded-3xl overflow-hidden aspect-square mb-4">
              {images[imgIdx] ? (
                <Image src={images[imgIdx]} alt={product.name} width={600} height={600} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-8xl">🌿</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${imgIdx===i ? 'border-green-500' : 'border-transparent card'}`}>
                    {img ? <Image src={img} alt={`${product.name} ${i+1}`} width={80} height={80} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl bg-green-50">🌿</div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Link href={`/shop?category=${product.category.slug}`} className="inline-flex items-center gap-1.5 text-xs font-heading font-bold tracking-widest uppercase text-green-600 hover:text-green-700 transition-colors mb-3">
                {product.category.icon} {product.category.name}
              </Link>
            )}
            <h1 className="font-heading font-black text-3xl lg:text-4xl text-green-900 dark:text-green-50 mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="font-heading font-black text-4xl text-green-700 dark:text-green-300">
                KES {product.price.toLocaleString()}
              </div>
              <div>
                <div className="text-green-500 text-sm">per {product.unit}</div>
                {product.comparePrice && <div className="text-gray-400 text-sm line-through">KES {product.comparePrice.toLocaleString()}</div>}
              </div>
              {discount > 0 && <span className="badge-sale text-sm px-3 py-1">-{discount}% OFF</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.organic && <span className="badge-organic">🌱 Certified Organic</span>}
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                {product.stock > 10 ? '✅ In Stock' : product.stock > 0 ? `⚠️ Only ${product.stock} left` : '❌ Out of Stock'}
              </span>
            </div>

            <p className="text-[var(--text-3)] leading-relaxed mb-8 text-base">{product.description}</p>

            {/* Add to cart */}
            {product.stock > 0 && (
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-green-200 dark:border-green-800 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty-1))} className="w-12 h-12 flex items-center justify-center text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all font-bold text-lg">−</button>
                  <span className="w-12 text-center font-heading font-black text-green-900 dark:text-green-100">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty+1))} className="w-12 h-12 flex items-center justify-center text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all font-bold text-lg">+</button>
                </div>
                <button onClick={handleAdd} disabled={adding} className={`btn-primary flex-1 text-base ${adding ? 'opacity-80' : ''}`}>
                  {adding ? '✓ Added!' : `🛒 Add to Cart · KES ${(product.price * qty).toLocaleString()}`}
                </button>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            )}

            {/* Delivery note */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900">
              <p className="text-sm text-green-700 dark:text-green-400">🚚 <strong>Same-day delivery</strong> available for orders placed before 12PM · 🔒 Secure checkout · ✅ Quality guaranteed</p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-heading font-black text-2xl mb-8 text-green-900 dark:text-green-100">You Might Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => (
                <div key={p.id} className="card card-hover rounded-2xl overflow-hidden group flex flex-col">
                  <Link href={`/shop/${p.slug}`} className="aspect-[4/3] overflow-hidden bg-green-50 dark:bg-green-900/30 block">
                    {p.images[0] ? <Image src={p.images[0]} alt={p.name} width={300} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>}
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <Link href={`/shop/${p.slug}`} className="font-heading font-bold text-sm text-green-900 dark:text-green-100 hover:text-green-600 transition-colors mb-1">{p.name}</Link>
                    <div className="font-heading font-black text-green-700 dark:text-green-300 mt-auto">KES {p.price.toLocaleString()} <span className="text-green-500 text-xs font-normal">/ {p.unit}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
