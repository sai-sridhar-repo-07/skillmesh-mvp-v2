import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import Session from "../models/Session";

const prisma = new PrismaClient();
const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).user.id;
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const hosted = await Session.countDocuments({ hostId: userId });
  const attended = await Session.countDocuments({ "participants.userId": userId });
  const earningsAgg = await prisma.transaction.aggregate({
    where: { userId, type: "earn", status: "succeeded" },
    _sum: { credits: true, amountCents: true }
  });
  res.json({
    balanceCredits: wallet?.balanceCredits ?? 0,
    sessionsHosted: hosted,
    sessionsAttended: attended,
    earnedCredits: earningsAgg._sum.credits ?? 0,
    earnedAmountCents: earningsAgg._sum.amountCents ?? 0
  });
});

export default router;
