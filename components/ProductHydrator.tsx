"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { fetchProducts } from "@/lib/products";

/**
 * Loads products from Supabase into the Zustand store on mount and exposes
 * a `window.refreshProducts()` helper for admin code to re-pull after
 * mutations.
 *
 * Renders nothing.
 */
export default function ProductHydrator() {
  const setProducts = useStore((s) => s.setProducts);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const products = await fetchProducts();
      if (!cancelled) setProducts(products);
    })();

    // Expose a tiny refresh helper for admin pages.
    (window as unknown as { refreshProducts?: () => Promise<void> }).refreshProducts =
      async () => {
        const products = await fetchProducts();
        setProducts(products);
      };

    return () => {
      cancelled = true;
    };
  }, [setProducts]);

  return null;
}
