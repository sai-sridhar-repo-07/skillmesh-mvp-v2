import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { createCreditCheckout } from "../utils/stripeAdapter";
import Stripe from "stripe";

const prisma = new PrismaClient();
const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).user.id;
  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) wallet = await prisma.wallet.create({ data: { userId } });
  const tx = await prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ balanceCredits: wallet.balanceCredits, transactions: tx });
});

router.post("/purchase", requireAuth, async (req, res) => {
  const { credits } = req.body || {};
  if (!credits || credits <= 0) return res.status(400).json({ error: "Invalid credits" });
  const userId = (req as any).user.id;
  const checkout = await createCreditCheckout(userId, credits);
  res.json(checkout);
});

// Stripe webhook with signature verification & idempotency
router.post("/webhook/stripe", (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent((req as any).rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  (async () => {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const credits = Number(session.metadata?.credits || 0);
      const providerRef = session.id;
      if (userId && credits > 0) {
        await prisma.$transaction(async (tx) => {
          // Idempotency based on (provider, providerRef) unique
          const existing = await tx.transaction.findFirst({ where: { provider: "stripe", providerRef } });
          if (existing) return;
          let w = await tx.wallet.findUnique({ where: { userId } });
          if (!w) w = await tx.wallet.create({ data: { userId } });
          await tx.wallet.update({ where: { userId }, data: { balanceCredits: w.balanceCredits + credits } });
          await tx.transaction.create({
            data: {
              userId,
              type: "purchase",
              credits,
              amountCents: credits * Number(process.env.CREDIT_PRICE_CENTS || 100),
              currency: process.env.CURRENCY || "USD",
              status: "succeeded",
              provider: "stripe",
              providerRef,
              meta: {}
            }
          });
        });
      }
    }
  })().then(() => res.json({ received: true })).catch(e => {
    console.error(e);
    res.status(500).json({ error: "Webhook handler error" });
  });
});

export default router;
