'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import toast from 'react-hot-toast';

interface Product {
  id: string; name: string; slug: string; price: number; comparePrice?: number|null;
  unit: string; images: string[]; organic: boolean; stock: number;
  category?: { name: string };
}

export default function ProductCard({ p }: { p: Product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (p.stock === 0) return;
    setAdding(true);
    addItem({ id: p.id, name: p.name, slug: p.slug, price: p.price, unit: p.unit, image: p.images[0] || '', stock: p.stock });
    toast.success(`${p.name} added to cart!`, { icon: '🌿' });
    setTimeout(() => setAdding(false), 600);
  };

  const discount = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;

  return (
    <div className="card card-hover rounded-2xl overflow-hidden group flex flex-col">
      {/* Image */}
      <Link href={`/shop/${p.slug}`} className="relative block overflow-hidden bg-green-50 dark:bg-green-900/30">
        <div className="aspect-[4/3] overflow-hidden">
          {p.images[0] ? (
            <Image src={p.images[0]} alt={p.name} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🌿</div>
          )}
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {p.organic && <span className="badge-organic">🌱 Organic</span>}
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
          {p.stock === 0 && <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gray-100 text-gray-500">Out of stock</span>}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {p.category && <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest mb-1">{p.category.name}</p>}
        <Link href={`/shop/${p.slug}`} className="font-heading font-bold text-green-900 dark:text-green-100 text-sm leading-snug hover:text-green-600 dark:hover:text-green-400 transition-colors mb-2 line-clamp-2">
          {p.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <div className="font-heading font-black text-lg text-green-700 dark:text-green-300">
              KES {p.price.toLocaleString()}
            </div>
            <div className="text-xs text-green-500 dark:text-green-500">per {p.unit}
              {p.comparePrice && <span className="line-through ml-1 text-gray-400">KES {p.comparePrice.toLocaleString()}</span>}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={p.stock === 0 || adding}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm transition-all flex-shrink-0 ${
              p.stock === 0 ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' :
              adding ? 'bg-green-400 scale-95' : 'grad-green hover:opacity-90 hover:scale-110'
            }`}
          >
            {adding ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}
