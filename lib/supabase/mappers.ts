import type { Locale, Product, Order } from "@/types";

/** Raw shape of the `products` row in Supabase. */
export interface ProductRow {
  id: string;
  created_at: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  ingredients: Record<Locale, string> | null;
  price: number | string;
  category: Product["category"];
  image: string;
  images: string[] | null;
  featured: boolean;
  available: boolean;
  weight: string | null;
  allergens: string[] | null;
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    description: row.description,
    ingredients: row.ingredients ?? undefined,
    // Supabase numerics come back as string when using JSONB-ish paths; coerce.
    price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
    category: row.category,
    image: row.image,
    images: row.images ?? undefined,
    featured: row.featured,
    available: row.available,
    weight: row.weight ?? undefined,
    allergens: row.allergens ?? undefined,
  };
}

/** Raw shape of the `orders` row in Supabase. */
export interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string | null;
  pickup_date: string | null;
  items: Order["items"];
  total: number | string;
  status: Order["status"];
  notes: string | null;
  stripe_session_id: string | null;
  payment_status: Order["paymentStatus"];
  paid_at: string | null;
}

export function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address ?? undefined,
    pickupDate: row.pickup_date ?? "",
    items: row.items,
    total: typeof row.total === "string" ? parseFloat(row.total) : row.total,
    status: row.status,
    notes: row.notes ?? undefined,
    stripeSessionId: row.stripe_session_id ?? undefined,
    paymentStatus: row.payment_status ?? "unpaid",
    paidAt: row.paid_at ?? undefined,
  };
}
