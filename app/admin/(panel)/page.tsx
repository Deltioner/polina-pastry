"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, TrendingUp, Star, Plus, Eye } from "lucide-react";
import { useStore } from "@/lib/store";
import { fetchOrders } from "@/lib/orders";
import type { Order } from "@/types";

export default function AdminDashboard() {
  const products = useStore((s) => s.products);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchOrders();
      if (!cancelled) setOrders(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      tone: "text-burgundy-500 bg-blush-100",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Featured Items",
      value: products.filter((p) => p.featured).length,
      icon: Star,
      tone: "text-gold-700 bg-gold-100",
    },
    {
      label: "Revenue (€)",
      value: `€${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}`,
      icon: TrendingUp,
      tone: "text-blue-700 bg-blue-50",
    },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <p className="script text-2xl text-caramel-500 mb-1">welcome back</p>
        <h1 className="font-display text-4xl text-burgundy-500 font-medium">Dashboard</h1>
        <p className="font-body text-sm text-burgundy-700/55 mt-2">Here&apos;s what&apos;s sweet today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="bg-white border border-blush-100 rounded-2xl p-5 hover:border-blush-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-xs tracking-wider uppercase text-burgundy-700/55">
                {label}
              </span>
              <div
                className={`w-9 h-9 rounded-full ${tone} flex items-center justify-center`}
              >
                <Icon size={15} />
              </div>
            </div>
            <p className="font-display text-3xl text-burgundy-800 font-medium">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white border border-blush-100 rounded-2xl p-6">
          <h2 className="font-display text-xl text-burgundy-500 font-medium mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/products"
              className="btn-primary flex items-center gap-2 p-3.5 text-xs justify-center"
            >
              <Package size={14} /> Manage Products
            </Link>
            <Link
              href="/admin/products"
              className="btn-gold flex items-center gap-2 p-3.5 text-xs justify-center"
            >
              <Plus size={14} /> Add Product
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 p-3.5 border border-blush-200 rounded-full text-xs text-burgundy-700 hover:border-burgundy-500 hover:text-burgundy-500 transition-colors justify-center font-body"
            >
              <ShoppingCart size={14} /> View Orders
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 p-3.5 border border-blush-200 rounded-full text-xs text-burgundy-700 hover:border-burgundy-500 hover:text-burgundy-500 transition-colors justify-center font-body"
            >
              <Eye size={14} /> View Store
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-blush-100 rounded-2xl p-6">
          <h2 className="font-display text-xl text-burgundy-500 font-medium mb-5">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="script text-2xl text-caramel-500 mb-1">no orders yet</p>
              <p className="font-body text-sm text-burgundy-700/45">
                Orders will appear when customers checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...orders]
                .reverse()
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-blush-100 last:border-0"
                  >
                    <div>
                      <p className="font-body text-sm font-medium text-burgundy-800">{order.id}</p>
                      <p className="font-body text-xs text-burgundy-700/45">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-burgundy-800">€{order.total.toFixed(2)}</p>
                      <span className="font-body text-xs uppercase tracking-wider px-2 py-0.5 bg-blush-100 text-burgundy-500 rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
