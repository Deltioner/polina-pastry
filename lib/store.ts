"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem, Locale, ProductCategory } from "@/types";

/**
 * Cart + locale + an in-memory products cache.
 *
 * `products` are NOT persisted — they are hydrated from Supabase on every
 * session by the <ProductHydrator/> mounted in the root layout. This avoids
 * stale prices/availability sitting in a customer's localStorage.
 *
 * `cart` and `locale` ARE persisted (localStorage, key `polina-pastry-store`).
 */
interface Store {
  products: Product[];
  cart: CartItem[];
  locale: Locale;

  setProducts: (products: Product[]) => void;
  upsertProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  setLocale: (locale: Locale) => void;

  getProductsByCategory: (category: ProductCategory | "all") => Product[];
  getFeaturedProducts: () => Product[];

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      locale: "en",

      setProducts: (products) => set({ products }),
      upsertProduct: (product) =>
        set((s) => {
          const idx = s.products.findIndex((p) => p.id === product.id);
          if (idx === -1) return { products: [product, ...s.products] };
          const next = [...s.products];
          next[idx] = product;
          return { products: next };
        }),
      removeProduct: (productId) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== productId) })),
      setLocale: (locale) => set({ locale }),

      getProductsByCategory: (category) => {
        const { products } = get();
        return category === "all"
          ? products
          : products.filter((p) => p.category === category);
      },

      getFeaturedProducts: () =>
        get().products.filter((p) => p.featured && p.available),

      addToCart: (product) =>
        set((s) => {
          const existing = s.cart.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { cart: [...s.cart, { product, quantity: 1 }] };
        }),

      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((i) => i.product.id !== productId) })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((s) => ({
          cart: s.cart.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () =>
        get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      getCartCount: () =>
        get().cart.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "polina-pastry-store",
      // Only persist cart + locale. Products are hydrated from Supabase per-session.
      partialize: (s) => ({ cart: s.cart, locale: s.locale }),
    },
  ),
);
