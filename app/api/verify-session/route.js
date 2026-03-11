import Stripe from "stripe";

export async function GET(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) return Response.json({ paid: false });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid";
    return Response.json({ paid });
  } catch {
    return Response.json({ paid: false });
  }
}
