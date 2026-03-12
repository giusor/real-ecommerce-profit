import Stripe from "stripe";

export const runtime = "nodejs";

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req) {
  try {
    const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));
    const siteUrl = getEnv("NEXT_PUBLIC_SITE_URL");
    const priceId = getEnv("STRIPE_PRICE_ID_EUR");

    // accept optional lang; not strictly needed
    let body = {};
    try { body = await req.json(); } catch {}
    const lang = body?.lang === "it" ? "it" : "en";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=1`,
      metadata: {
        purpose: "pdf",
        lang
      }
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to create checkout session" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
