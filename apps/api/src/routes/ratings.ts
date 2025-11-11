import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { RatingCreateDTO } from "../dto";
import Rating from "../models/Rating";
import User from "../models/User";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const parse = RatingCreateDTO.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const raterId = (req as any).user.id;
  const doc = await Rating.create({ ...parse.data, raterId });
  // update aggregates
  const stats = await Rating.aggregate([
    { $match: { rateeId: doc.rateeId } },
    { $group: { _id: "$rateeId", avg: { $avg: "$stars" }, count: { $sum: 1 } } }
  ]);
  const s = stats[0];
  await User.findByIdAndUpdate(doc.rateeId, { ratingAvg: s?.avg || 0, ratingCount: s?.count || 0 });
  res.status(201).json(doc);
});

router.get("/user/:userId", async (req, res) => {
  const list = await Rating.find({ rateeId: req.params.userId }).sort({ createdAt: -1 });
  const avg = list.length ? list.reduce((a,b)=>a+b.stars,0)/list.length : 0;
  res.json({ avg, count: list.length, list });
});

export default router;
