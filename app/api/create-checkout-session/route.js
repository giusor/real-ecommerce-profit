import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await req.json();
  const lang = body?.lang === "it" ? "it" : "en";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const priceId = lang === "it" ? process.env.STRIPE_PRICE_ID_EUR : process.env.STRIPE_PRICE_ID_USD;

  if (!siteUrl || !priceId) {
    return Response.json({ error: "Missing env vars" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/pro?canceled=1`
  });

  return Response.json({ url: session.url });
}
