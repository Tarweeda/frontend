import { create } from 'zustand';
import type { Product, CartItem } from '../types/product';

interface CartState {
  items: CartItem[];
  fulfilment: 'delivery' | 'collection';
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, delta: number) => void;
  setFulfilment: (type: 'delivery' | 'collection') => void;
  clearCart: () => void;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  fulfilment: 'delivery',

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, qty: 1 }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),

  updateQty: (productId, delta) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      ),
    })),

  setFulfilment: (type) => set({ fulfilment: type }),

  clearCart: () => set({ items: [], fulfilment: 'delivery' }),

  subtotal: () => get().items.reduce((sum, i) => sum + i.price_pence * i.qty, 0),
  deliveryFee: () => (get().fulfilment === 'delivery' ? 500 : 0),
  total: () => get().subtotal() + get().deliveryFee(),
  itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));
