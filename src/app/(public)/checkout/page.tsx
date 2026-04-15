'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useSettings } from '@/components/SettingsProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const settings = useSettings();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);

  const deliveryFee = subtotal >= parseFloat(settings.free_delivery_min || '2000') ? 0 : parseFloat(settings.delivery_fee || '200');
  const total       = subtotal + deliveryFee;

  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    deliveryAddress: '', city: 'Nairobi', notes: '', paymentMethod: 'mpesa',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: items.map(i => ({ productId:i.id, name:i.name, price:i.price, unit:i.unit, quantity:i.quantity, total:i.price*i.quantity })), subtotal, deliveryFee, total }),
      });
      const d = await res.json();
      if (res.ok) {
        clearCart();
        router.push(`/order-success?order=${d.orderNumber}`);
      } else {
        toast.error(d.error || 'Failed to place order');
      }
    } catch { toast.error('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-center px-6 pb-24">
      <div className="card rounded-3xl p-12 max-w-md">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-heading font-black text-2xl mb-2">Your cart is empty</h2>
        <p className="text-[var(--text-3)] mb-6">Add some fresh products before checking out.</p>
        <Link href="/shop" className="btn-primary">Browse Shop →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 px-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading font-black text-3xl text-green-900 dark:text-green-100 mb-10">Checkout</h1>

        <form onSubmit={submit}>
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Contact */}
              <div className="card rounded-2xl p-6">
                <h2 className="font-heading font-bold text-lg mb-5 text-green-900 dark:text-green-100">Contact Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Full Name *</label>
                    <input required className="inp" value={form.customerName} onChange={e=>set('customerName',e.target.value)} placeholder="John Kamau" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Email *</label>
                      <input required type="email" className="inp" value={form.customerEmail} onChange={e=>set('customerEmail',e.target.value)} placeholder="john@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Phone *</label>
                      <input required className="inp" value={form.customerPhone} onChange={e=>set('customerPhone',e.target.value)} placeholder="+254 700 000 000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="card rounded-2xl p-6">
                <h2 className="font-heading font-bold text-lg mb-5 text-green-900 dark:text-green-100">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Street Address *</label>
                    <textarea required className="inp" rows={3} value={form.deliveryAddress} onChange={e=>set('deliveryAddress',e.target.value)} placeholder="House/Apartment number, Street name, Estate" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">City</label>
                    <select className="inp" value={form.city} onChange={e=>set('city',e.target.value)}>
                      {['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Order Notes (optional)</label>
                    <textarea className="inp" rows={2} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Any special delivery instructions?" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card rounded-2xl p-6">
                <h2 className="font-heading font-bold text-lg mb-5 text-green-900 dark:text-green-100">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value:'mpesa',  label:'M-Pesa', icon:'📱', desc:`Paybill: ${settings.mpesa_paybill || 'Will be provided on confirmation'}` },
                    { value:'cash',   label:'Cash on Delivery', icon:'💵', desc:'Pay when your order arrives' },
                    { value:'card',   label:'Credit / Debit Card', icon:'💳', desc:'Secure card payment via Stripe' },
                  ].map(pm => (
                    <label key={pm.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod===pm.value ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-green-100 dark:border-green-800 hover:border-green-300'}`}>
                      <input type="radio" name="paymentMethod" value={pm.value} checked={form.paymentMethod===pm.value} onChange={e=>set('paymentMethod',e.target.value)} className="accent-green-600" />
                      <span className="text-2xl">{pm.icon}</span>
                      <div>
                        <div className="font-heading font-bold text-sm text-green-900 dark:text-green-100">{pm.label}</div>
                        <div className="text-green-600 dark:text-green-400 text-xs">{pm.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="card rounded-2xl p-6 sticky top-24">
                <h2 className="font-heading font-bold text-lg mb-5 text-green-900 dark:text-green-100">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex-shrink-0 overflow-hidden">
                        {item.image ? <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100 truncate">{item.name}</p>
                        <p className="text-xs text-green-500">{item.quantity}× {item.unit}</p>
                      </div>
                      <div className="text-sm font-bold text-green-800 dark:text-green-200">KES {(item.price*item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-green-100 dark:border-green-900 pt-4 space-y-2 text-sm mb-5">
                  <div className="flex justify-between text-green-700 dark:text-green-400"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-green-700 dark:text-green-400">
                    <span>Delivery</span>
                    <span>{deliveryFee===0 ? <span className="text-green-600 font-bold">FREE</span> : `KES ${deliveryFee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg text-green-900 dark:text-green-100 pt-2 border-t border-green-100 dark:border-green-900">
                    <span>Total</span><span>KES {total.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
                  {loading ? '⏳ Placing Order…' : '✅ Place Order →'}
                </button>
                <p className="text-center text-xs text-green-500 mt-3">🔒 Your data is secure and encrypted</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
