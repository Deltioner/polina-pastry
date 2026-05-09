"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapOrderRow, type OrderRow } from "@/lib/supabase/mappers";
import type { Order } from "@/types";

const TABLE = "orders";

/**
 * Browser-side fetch of orders. Only authenticated admins can read (enforced
 * by RLS); the call returns [] for unauthenticated users or unconfigured env.
 */
export async function fetchOrders(): Promise<Order[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[orders] fetch failed:", error);
    return [];
  }
  return (data as OrderRow[]).map(mapOrderRow);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[orders] status update failed:", error);
    return false;
  }
  return true;
}

/** Permanently delete a single order. Authenticated only. */
export async function deleteOrder(id: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) {
    console.error("[orders] delete failed:", error);
    return false;
  }
  return true;
}

/**
 * Bulk-delete every order that hasn't been paid yet — useful for cleaning
 * up test orders or abandoned checkouts.
 * Returns the number of rows deleted, or null on failure.
 */
export async function deleteUnpaidOrders(): Promise<number | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("payment_status", "unpaid")
    .select("id");

  if (error) {
    console.error("[orders] bulk delete unpaid failed:", error);
    return null;
  }
  return data?.length ?? 0;
}
