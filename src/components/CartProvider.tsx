'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  id:       string;
  name:     string;
  slug:     string;
  price:    number;
  unit:     string;
  image:    string;
  quantity: number;
  stock:    number;
}

interface CartCtx {
  items:       CartItem[];
  count:       number;
  subtotal:    number;
  addItem:     (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem:  (id: string) => void;
  updateQty:   (id: string, qty: number) => void;
  clearCart:   () => void;
  isOpen:      boolean;
  openCart:    () => void;
  closeCart:   () => void;
  toggleCart:  () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready,  setReady]  = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agrifusion_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (ready) localStorage.setItem('agrifusion_cart', JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id
          ? { ...i, quantity: Math.min(i.quantity + qty, item.stock) }
          : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(qty, item.stock) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem  = useCallback((id: string) => setItems(p => p.filter(i => i.id !== id)), []);
  const updateQty   = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(p => p.map(i => i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i));
  }, [removeItem]);
  const clearCart   = useCallback(() => setItems([]), []);
  const openCart    = useCallback(() => setIsOpen(true),  []);
  const closeCart   = useCallback(() => setIsOpen(false), []);
  const toggleCart  = useCallback(() => setIsOpen(p => !p), []);

  const count    = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, count, subtotal, addItem, removeItem, updateQty, clearCart, isOpen, openCart, closeCart, toggleCart }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
