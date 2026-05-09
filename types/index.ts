export type Locale = "en" | "uk" | "nl" | "ar";

export interface Product {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  price: number;
  category: ProductCategory;
  image: string;
  /** Optional gallery images shown on the product detail page; the main `image` is always shown first. */
  images?: string[];
  /** Optional ingredients text (multi-line allowed) shown on the product detail page. */
  ingredients?: Record<Locale, string>;
  featured: boolean;
  available: boolean;
  createdAt: string;
  allergens?: string[];
  weight?: string;
}

export type ProductCategory =
  | "cakes"
  | "pastries"
  | "cookies"
  | "bread"
  | "seasonal"
  | "custom";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  pickupDate: string;
  status: "pending" | "confirmed" | "ready" | "delivered" | "cancelled";
  createdAt: string;
  notes?: string;
  stripeSessionId?: string;
  paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
  paidAt?: string;
}

export interface Translation {
  nav: {
    home: string;
    shop: string;
    about: string;
    contact: string;
    cart: string;
    ukraine: string;
  };
  hero: {
    tagline: string;
    subtitle: string;
    cta: string;
    secondary_cta: string;
  };
  shop: {
    title: string;
    all: string;
    cakes: string;
    pastries: string;
    cookies: string;
    bread: string;
    seasonal: string;
    custom: string;
    add_to_cart: string;
    out_of_stock: string;
    featured: string;
  };
  product: {
    ingredients: string;
    allergens: string;
    weight: string;
    quantity: string;
    order_now: string;
    add_to_cart: string;
    related: string;
    back_to_shop: string;
    no_ingredients: string;
  };
  about: {
    title: string;
    story: string;
    craft: string;
    promise: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
    quantity: string;
  };
  ukraine: {
    title: string;
    kicker: string;
    intro: string;
    nature_title: string;
    nature_text: string;
    oats_title: string;
    oats_text: string;
    people_title: string;
    people_text: string;
    paska_title: string;
    paska_text: string;
    women_title: string;
    women_text: string;
    hope_title: string;
    hope_text: string;
    war_title: string;
    war_text: string;
    closing: string;
    cta: string;
  };
  admin: {
    title: string;
    products: string;
    orders: string;
    add_product: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    name: string;
    description: string;
    price: string;
    category: string;
    image_url: string;
    featured: string;
    available: string;
    confirm_delete: string;
    dashboard: string;
    total_products: string;
    total_orders: string;
  };
  footer: {
    tagline: string;
    made_with: string;
    rights: string;
  };
}
