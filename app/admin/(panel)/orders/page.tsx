"use client";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  ChevronDown,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
  deleteUnpaidOrders,
} from "@/lib/orders";
import type { Order } from "@/types";
import clsx from "clsx";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  ready: "bg-emerald-50 text-emerald-700",
  delivered: "bg-blush-100 text-burgundy-700",
  cancelled: "bg-red-50 text-red-500",
};

const STATUSES: Order["status"][] = ["pending", "confirmed", "ready", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Order | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const sorted = orders;
  const unpaidCount = orders.filter((o) => o.paymentStatus === "unpaid").length;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchOrders();
      if (!cancelled) {
        setOrders(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatus = async (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await updateOrderStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteOrder(id);
    setConfirmDelete(null);
    if (ok) setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleBulkDeleteUnpaid = async () => {
    const removed = await deleteUnpaidOrders();
    setConfirmBulk(false);
    if (removed !== null) {
      setOrders((prev) => prev.filter((o) => o.paymentStatus !== "unpaid"));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="script text-2xl text-caramel-500 mb-1">manage</p>
          <h1 className="font-display text-4xl text-burgundy-500 font-medium">Orders</h1>
          <p className="font-body text-sm text-burgundy-700/55 mt-1">
            {orders.length} total · {unpaidCount} unpaid
          </p>
        </div>
        {unpaidCount > 0 && (
          <button
            onClick={() => setConfirmBulk(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blush-100 text-burgundy-700 hover:bg-blush-200 font-body text-sm transition-colors"
            title="Useful for cleaning up test orders that never completed payment"
          >
            <Sparkles size={13} /> Clear {unpaidCount} unpaid
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 bg-white rounded-3xl border border-blush-100">
          <Loader2 size={28} className="text-burgundy-500 animate-spin" />
          <p className="font-body text-sm text-burgundy-700/55">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-3xl border border-blush-100">
          <div className="w-20 h-20 rounded-full bg-blush-100 flex items-center justify-center">
            <ShoppingCart size={32} className="text-burgundy-500" />
          </div>
          <p className="script text-3xl text-caramel-500">no orders yet</p>
          <p className="font-body text-sm text-burgundy-700/45">
            Orders will appear here when customers checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-blush-100 rounded-2xl overflow-hidden hover:border-blush-300 transition-colors"
            >
              {/* Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 grid grid-cols-4 gap-4 items-center min-w-0">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium text-burgundy-800 truncate">
                      {order.id}
                    </p>
                    <p className="font-body text-xs text-burgundy-700/45">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm text-burgundy-800 truncate">
                      {order.customerName}
                    </p>
                    <p className="font-body text-xs text-burgundy-700/45 truncate">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-xl text-burgundy-500 font-medium">
                      €{order.total.toFixed(2)}
                    </span>
                    <span
                      className={clsx(
                        "font-body text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full inline-block w-fit",
                        order.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.paymentStatus === "failed"
                          ? "bg-red-50 text-red-600"
                          : order.paymentStatus === "refunded"
                          ? "bg-blush-100 text-burgundy-600"
                          : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleStatus(order.id, e.target.value as Order["status"])
                      }
                      className={clsx(
                        "font-body text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border-none focus:outline-none cursor-pointer",
                        STATUS_STYLES[order.status]
                      )}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(order);
                  }}
                  className="p-2 rounded-full text-burgundy-700/30 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  aria-label="Delete order"
                >
                  <Trash2 size={14} />
                </button>
                <ChevronDown
                  size={15}
                  className={clsx(
                    "text-burgundy-700/35 transition-transform shrink-0",
                    expanded === order.id && "rotate-180"
                  )}
                />
              </div>

              {/* Expanded */}
              {expanded === order.id && (
                <div className="border-t border-blush-100 px-5 py-6 bg-blush-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-4">
                        Order Items
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex justify-between font-body text-sm text-burgundy-700/80"
                          >
                            <span>
                              {item.product.name.en} × {item.quantity}
                            </span>
                            <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t border-blush-200 pt-3 mt-3 flex justify-between font-display text-burgundy-800">
                          <span>Total</span>
                          <span className="text-burgundy-500 font-medium">
                            €{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-4">
                        Customer Details
                      </p>
                      <div className="space-y-2 font-body text-sm text-burgundy-700/80">
                        <p>
                          <span className="text-burgundy-700/45">Name: </span>
                          {order.customerName}
                        </p>
                        <p>
                          <span className="text-burgundy-700/45">Email: </span>
                          {order.customerEmail}
                        </p>
                        <p>
                          <span className="text-burgundy-700/45">Phone: </span>
                          {order.customerPhone}
                        </p>
                        <p>
                          <span className="text-burgundy-700/45">Pickup: </span>
                          {order.pickupDate}
                        </p>
                        {order.deliveryAddress && (
                          <p>
                            <span className="text-burgundy-700/45">Address: </span>
                            {order.deliveryAddress}
                          </p>
                        )}
                        {order.notes && (
                          <p>
                            <span className="text-burgundy-700/45">Notes: </span>
                            {order.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── DELETE CONFIRM ──────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-burgundy-800/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-blush-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-red-400" />
            </div>
            <h3 className="font-display text-2xl text-burgundy-800 font-medium mb-2">
              Delete order?
            </h3>
            <p className="font-body text-burgundy-700/55 mb-2">
              {confirmDelete.customerName} · €{confirmDelete.total.toFixed(2)}
            </p>
            <p className="font-body text-xs text-burgundy-700/45 mb-7">
              {confirmDelete.paymentStatus === "paid"
                ? "⚠ This order was paid. Deleting only removes the record from your shop — Stripe still has the payment data and you should refund through Stripe if needed."
                : "This action cannot be undone."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 border border-blush-200 rounded-full font-body text-sm hover:border-burgundy-700/50 transition-colors text-burgundy-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 py-3 bg-red-500 text-white rounded-full font-body text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BULK DELETE UNPAID CONFIRM ──────────────────── */}
      {confirmBulk && (
        <div className="fixed inset-0 z-50 bg-burgundy-800/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-blush-100">
            <div className="w-16 h-16 rounded-full bg-blush-100 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={28} className="text-burgundy-500" />
            </div>
            <h3 className="font-display text-2xl text-burgundy-800 font-medium mb-2">
              Clear unpaid orders?
            </h3>
            <p className="font-body text-burgundy-700/55 mb-7">
              This will permanently delete all <strong>{unpaidCount}</strong>{" "}
              unpaid order{unpaidCount === 1 ? "" : "s"}. Paid orders are not
              affected. Cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBulk(false)}
                className="flex-1 py-3 border border-blush-200 rounded-full font-body text-sm hover:border-burgundy-700/50 transition-colors text-burgundy-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteUnpaid}
                className="flex-1 py-3 bg-burgundy-500 text-white rounded-full font-body text-sm hover:bg-burgundy-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
