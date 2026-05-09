"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeft,
  Cake,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { signOutAction } from "@/app/admin/login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-cream-50">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 flex flex-col shrink-0 min-h-screen">
        {/* Brand */}
        <div className="px-6 py-7 border-b border-cream-50/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-2xl flex items-center justify-center shadow-md">
              <Cake size={18} className="text-burgundy-800" />
            </div>
            <div>
              <p className="font-display text-2xl text-cream-50 leading-none">Polina</p>
              <p className="script text-base text-blush-200 leading-none mt-1">admin panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-body text-sm transition-all",
                  active
                    ? "bg-cream-50/15 text-cream-50 shadow-sm"
                    : "text-blush-200 hover:text-cream-50 hover:bg-cream-50/8",
                )}
              >
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>

        {/* User block */}
        <div className="px-3 pb-3 border-t border-cream-50/10 pt-4 mx-3 mb-2">
          <div className="px-2 pb-2">
            <p className="font-body text-[10px] uppercase tracking-widest text-blush-200/60 mb-0.5">
              Signed in as
            </p>
            <p className="font-body text-sm text-cream-50 truncate">{email}</p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl font-body text-sm text-blush-200 hover:bg-cream-50/8 hover:text-cream-50 transition-colors"
            >
              <LogOut size={13} /> Sign out
            </button>
          </form>
        </div>

        {/* View Store */}
        <div className="px-3 pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl font-body text-sm text-blush-200 hover:bg-cream-50/8 hover:text-cream-50 transition-colors"
          >
            <ArrowLeft size={13} /> Back to store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
