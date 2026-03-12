import Stripe from "stripe";

export const runtime = "nodejs";

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET(req) {
  try {
    const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return new Response(JSON.stringify({ paid: false, error: "Missing session_id" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid";
    const purpose = session?.metadata?.purpose || null;

    return Response.json({ paid, purpose });
  } catch (err) {
    return new Response(
      JSON.stringify({ paid: false, error: err?.message || "Failed to verify session" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
