import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import Notification from "../models/Notification";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).user.id;
  const list = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
  res.json(list);
});

router.post("/:id/read", requireAuth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ ok: true });
});

export default router;
