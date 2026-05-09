"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Clears the local cart once the success page renders. Pure side-effect,
 * no UI. Lives as a separate file because the parent page is a Server
 * Component.
 */
export default function ClearCartOnMount() {
  const clearCart = useStore((s) => s.clearCart);
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}
