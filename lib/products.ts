"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapProductRow, type ProductRow } from "@/lib/supabase/mappers";
import type { Product, Locale } from "@/types";

const TABLE = "products";
const BUCKET = "product-images";

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[products] fetch failed:", error);
    return [];
  }
  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[products] fetchById failed:", error);
    return null;
  }
  return mapProductRow(data as ProductRow);
}

export interface ProductInput {
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  ingredients?: Record<Locale, string>;
  price: number;
  category: Product["category"];
  image: string;
  images?: string[];
  featured: boolean;
  available: boolean;
  weight?: string;
  allergens?: string[];
}

function toRow(input: ProductInput) {
  return {
    name: input.name,
    description: input.description,
    ingredients: input.ingredients ?? null,
    price: input.price,
    category: input.category,
    image: input.image,
    images: input.images ?? [],
    featured: input.featured,
    available: input.available,
    weight: input.weight ?? null,
    allergens: input.allergens ?? [],
  };
}

export async function createProduct(input: ProductInput): Promise<Product | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .insert(toRow(input))
    .select()
    .single();

  if (error || !data) {
    if (error) console.error("[products] create failed:", error);
    return null;
  }
  return mapProductRow(data as ProductRow);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .update(toRow(input))
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    if (error) console.error("[products] update failed:", error);
    return null;
  }
  return mapProductRow(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) {
    console.error("[products] delete failed:", error);
    return false;
  }
  return true;
}

/** Uploads a file to the product-images bucket and returns the public URL. */
export async function uploadProductImage(
  file: File,
): Promise<{ url: string; path: string } | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error("[products] image upload failed:", uploadError);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { url: publicUrl, path };
}
