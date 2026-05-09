# Polina Pastry — full-stack setup

This is the one-time setup to wire the site up to a real backend. After this,
products / orders / images / admin login all work for real customers.

Total time: ~15 minutes.

---

## 1. Create a Supabase project

1. Sign up at <https://supabase.com> and click **New project**.
2. Name it (e.g. `polina-pastry`), pick a strong **database password** (save it),
   choose the region closest to Kampen (Frankfurt or Stockholm), and create.
3. Wait ~1 min for the project to spin up.

## 2. Run the migration

1. Open the project in Supabase Studio.
2. Left sidebar → **SQL Editor** → **+ New query**.
3. Open `supabase/migration.sql` from this repo, copy its full contents, paste,
   click **Run**.

This creates:

- `products` table (with multilingual JSONB columns)
- `orders` table
- Row-Level-Security policies (public reads products, public inserts orders,
  admin gets full CRUD)
- A `product-images` storage bucket
- Storage policies (public read, authenticated write)
- The 8 seed products **plus the Ukrainian Paska** from your brief

## 3. Create Polina's admin user

1. Supabase Studio → **Authentication** → **Users** → **Add user → Create new user**.
2. Email = `polina.pastry1@gmail.com` (or whatever Polina uses).
3. Tick **Auto Confirm User** so she can log in immediately.
4. Set a password and save.

> 💡 You can also enable email/password sign-up in **Authentication → Providers**
> and let Polina sign herself up, then disable sign-up afterwards.

## 4. Get your Supabase keys

In Supabase Studio → **Project Settings** → **API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY` (don't paste this
  anywhere public — server-only)

## 5. Set up Gmail SMTP (transactional email — completely free)

The site sends order emails through Polina's own Gmail using an "App Password"
— no domain, no third-party email service required. Gmail's free tier handles
~500 sends/day, plenty for a small bakery.

1. Sign in to Polina's Gmail at <https://myaccount.google.com>.
2. **Security → 2-Step Verification → enable it.** (Required by Google for
   App Passwords.)
3. Go to <https://myaccount.google.com/apppasswords>.
4. App name: `Polina Pastry` → click **Create**.
5. Copy the 16-character password Google shows (e.g. `abcd efgh ijkl mnop`)
   — paste it **without spaces** as `GMAIL_APP_PASSWORD` in `.env.local`.
6. ⚠ This password is shown ONCE. If you lose it, generate a new one.

> 💡 Customers will see emails from `Polina Pastry <polina.pastry1@gmail.com>`.
> If you later buy a domain (e.g. `polinapastry.nl`) and want emails to come
> from `orders@polinapastry.nl`, you'd switch to a service like Resend or
> Postmark, but that's optional.

## 6. Fill in `.env.local`

Copy `.env.example` to `.env.local` and paste in the values from steps 4 and 5.

```bash
cp .env.example .env.local
```

Required keys:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
POLINA_EMAIL=polina.pastry1@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

## 7. Run it

```bash
npm install        # if you haven't already
npm run dev
```

Visit:

- <http://localhost:3000> — the public store
- <http://localhost:3000/admin> — redirects you to login
- <http://localhost:3000/admin/login> — sign in with Polina's email/password
- After login → `/admin` dashboard, `/admin/products` for CRUD, `/admin/orders`
  for incoming orders

## 8. Try it end-to-end

1. As an anonymous visitor, click a product, add to cart, go to cart, click
   **Proceed to Checkout**, fill the form, **Place order**.
2. Check Polina's inbox — she should have an email.
3. Check the buyer's inbox — they should have a confirmation email.
4. Sign in as admin → `/admin/orders` → the order is listed, change its status
   to **Confirmed**.

---

## What lives where

| Concern              | Where                                    |
| -------------------- | ---------------------------------------- |
| DB schema            | `supabase/migration.sql`                 |
| Supabase clients     | `lib/supabase/{client,server}.ts`        |
| Auth gating          | `middleware.ts` + `lib/supabase/middleware.ts` |
| Admin login          | `app/admin/login/`                        |
| Admin panel          | `app/admin/(panel)/` (route group)       |
| Public product reads | `lib/products.ts` (browser)              |
| Order placement      | `app/cart/actions.ts` (Server Action)    |
| Email                | Resend, called from `app/cart/actions.ts` |
| Image upload         | `lib/products.ts` → `product-images` bucket |
| Cart + locale state  | Zustand persist (localStorage)           |
| Products in memory   | Zustand non-persisted, hydrated by `<ProductHydrator/>` in `app/layout.tsx` |

## Deployment

Recommended: **Vercel** (Next.js's home).

```bash
npm i -g vercel
vercel
```

When prompted, paste the same `.env.local` values into Vercel's project env
settings (Production + Preview). Re-deploy after env changes.

Once deployed, update Resend's domain DNS records with your new domain so
emails come from `orders@yourdomain.tld`.

---

## Common gotchas

- **"401 / RLS error" when admin saves a product** → you're not logged in as a
  user that exists in `auth.users`. Re-check step 3.
- **Image upload fails** → make sure the `product-images` bucket exists and is
  public (the migration creates it). Storage policies must allow `authenticated`
  to insert (also in the migration).
- **Customer doesn't get email** → if you used `onboarding@resend.dev`, Resend
  only sends to **the email of the Resend account owner** in dev. Verify a
  domain in Resend to send to anyone.
- **Old products from localStorage are showing alongside new ones** → not
  possible anymore: products are no longer persisted to localStorage. Hard
  refresh and you'll see only what's in Supabase.
- **Site shows no products** → either the DB is empty (re-run migration) or
  the env vars aren't set. Check the browser console for Supabase errors.
