"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { signInAction } from "./actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setPending(true);
    const result = await signInAction(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoFocus
          autoComplete="email"
          placeholder="polina.pastry1@gmail.com"
          className="w-full border border-blush-200 rounded-2xl px-4 py-3 font-body text-burgundy-800 bg-white text-base placeholder:text-burgundy-700/30"
        />
      </div>

      <div>
        <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full border border-blush-200 rounded-2xl px-4 py-3 font-body text-burgundy-800 bg-white text-base placeholder:text-burgundy-700/30"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-50 text-red-700 border border-red-100">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-body text-sm">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3.5"
      >
        <Lock size={14} /> {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-blush-200/55 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-gold-200/35 blur-[120px] pointer-events-none"
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-sm text-burgundy-700/65 hover:text-burgundy-500 transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to store
        </Link>

        <div className="bg-white border border-blush-100 rounded-[32px] p-8 md:p-10 shadow-xl shadow-burgundy-500/8">
          <div className="text-center mb-8">
            <p className="script text-2xl text-caramel-500 mb-1">welcome back</p>
            <h1 className="font-display text-3xl text-burgundy-500 font-medium">
              Polina&apos;s kitchen
            </h1>
            <p className="font-body text-sm text-burgundy-700/55 mt-2">
              Sign in to manage products and orders.
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
