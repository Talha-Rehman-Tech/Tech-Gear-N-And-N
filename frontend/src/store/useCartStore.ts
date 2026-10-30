import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number, color?: string) => void;
  updateQuantity: (id: string | number, quantity: number, color?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.color === item.color
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }
          
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && (color === undefined || i.color === color))
          ),
        }));
      },

      updateQuantity: (id, quantity, color) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id && (color === undefined || i.color === color)) {
              return { ...i, quantity: Math.max(1, quantity) };
            }
            return i;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'techgear-cart',
    }
  )
);
