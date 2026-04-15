'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartProvider';
import { useSettings } from './SettingsProvider';

export default function CartDrawer() {
  const { items, count, subtotal, removeItem, updateQty, clearCart, isOpen, closeCart } = useCart();
  const settings = useSettings();
  const deliveryFee   = parseFloat(settings.delivery_fee || '200');
  const freeMin       = parseFloat(settings.free_delivery_min || '2000');
  const actualFee     = subtotal >= freeMin ? 0 : deliveryFee;
  const total         = subtotal + actualFee;
  const remaining     = freeMin - subtotal;

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm" onClick={closeCart} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[160] bg-white dark:bg-green-950 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-green-100 dark:border-green-900">
          <div>
            <h2 className="font-heading font-black text-lg text-green-900 dark:text-green-100">Your Cart</h2>
            <p className="text-green-600 dark:text-green-400 text-xs">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-500 transition-colors">Clear all</button>
            )}
            <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 transition-all">✕</button>
          </div>
        </div>

        {/* Free delivery progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-900">
            {subtotal >= freeMin ? (
              <p className="text-xs text-green-600 font-bold">🎉 You qualify for FREE delivery!</p>
            ) : (
              <>
                <p className="text-xs text-green-700 dark:text-green-400 mb-1.5">Add <strong>KES {remaining.toLocaleString()}</strong> more for free delivery</p>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                  <div className="grad-green h-1.5 rounded-full transition-all" style={{ width: `${Math.min((subtotal / freeMin) * 100, 100)}%` }} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-green-700 dark:text-green-400 font-medium">Your cart is empty</p>
              <p className="text-green-500 text-sm mt-1">Add some fresh items from our shop</p>
              <button onClick={closeCart} className="btn-primary mt-6 text-sm">Browse Shop →</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-3 card rounded-xl">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/50 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-sm text-green-900 dark:text-green-100 truncate">{item.name}</p>
                  <p className="text-green-600 dark:text-green-400 text-xs">KES {item.price.toLocaleString()} / {item.unit}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 flex items-center justify-center text-sm hover:bg-green-200 transition-all">−</button>
                      <span className="text-sm font-bold text-green-900 dark:text-green-100 w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 flex items-center justify-center text-sm hover:bg-green-200 transition-all disabled:opacity-40">+</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-green-800 dark:text-green-200">KES {(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-500 text-xs transition-colors">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-green-100 dark:border-green-900 px-6 py-5 space-y-4 bg-white dark:bg-green-950">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-green-700 dark:text-green-400">
                <span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-700 dark:text-green-400">
                <span>Delivery</span>
                <span>{actualFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `KES ${actualFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-black text-lg text-green-900 dark:text-green-100 pt-2 border-t border-green-100 dark:border-green-900">
                <span>Total</span><span>KES {total.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center">
              Proceed to Checkout →
            </Link>
            <button onClick={closeCart} className="w-full text-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
