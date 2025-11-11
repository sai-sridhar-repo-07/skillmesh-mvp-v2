import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function createCreditCheckout(userId: string, credits: number) {
  const priceCents = Number(process.env.CREDIT_PRICE_CENTS || 100);
  const amount = credits * priceCents;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      price_data: {
        currency: process.env.CURRENCY || "USD",
        product_data: { name: `${credits} Skill Credits` },
        unit_amount: amount
      },
      quantity: 1
    }],
    metadata: { userId, credits: String(credits) },
    success_url: `${process.env.CLIENT_ORIGIN}/dashboard?purchase=success`,
    cancel_url: `${process.env.CLIENT_ORIGIN}/dashboard?purchase=cancelled`
  });
  return { url: session.url };
}
