import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import WhiteboardSnapshot from "../models/WhiteboardSnapshot";

const router = Router();

router.post("/:sessionId/snapshot", requireAuth, async (req, res) => {
  const { sessionId } = req.params;
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "Missing data" });
  const snap = await WhiteboardSnapshot.create({ sessionId, data });
  res.status(201).json({ id: snap.id, createdAt: snap.createdAt });
});

router.get("/:sessionId/snapshots", requireAuth, async (req, res) => {
  const { sessionId } = req.params;
  const list = await WhiteboardSnapshot.find({ sessionId }).sort({ createdAt: -1 }).limit(10);
  res.json(list);
});

export default router;
