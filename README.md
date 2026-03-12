# Real Ecommerce Profit (Free + Paid PDF Export)

This is a Next.js (App Router) app.

## What is paid?
Only **PDF Export**: users buy **1 PDF credit** for **€1** (Stripe Checkout). Each export consumes 1 credit.
Credits are stored locally on the device in `localStorage` (`pdf_credits`).

## Local dev

```bash
npm install
npm run dev
```

## Vercel env vars (Production)

- `NEXT_PUBLIC_SITE_URL` (e.g. `https://realecommerceprofit.com`)
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID_EUR` (Stripe price set to €1)

## Routes

- `/` calculator
- `/success` verifies checkout and adds 1 PDF credit
- `/api/create-checkout-session` creates Stripe Checkout session
- `/api/verify-session` verifies session payment status
