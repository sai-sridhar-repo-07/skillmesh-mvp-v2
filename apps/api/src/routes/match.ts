import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import User from "../models/User";
import Session from "../models/Session";

const router = Router();

function scoreMentor(mentor: any, tags: string[]) {
  const overlap = mentor.tags?.filter((t: string) => tags.includes(t)).length || 0;
  const rating = mentor.ratingAvg || 0;
  return overlap * 2 + rating; // simple heuristic
}

router.post("/instant", requireAuth, async (req, res) => {
  const { tags = [] } = req.body || {};
  const mentors = await User.find({ roles: { $in: ["mentor"] } }).limit(100);
  const ranked = mentors
    .map(m => ({ m, s: scoreMentor(m, tags) }))
    .sort((a, b) => b.s - a.s);
  const best = ranked[0]?.m;
  if (!best) return res.status(404).json({ error: "No mentors available" });
  // Create instant session with the mentor as host
  const session = await Session.create({
    hostId: best.id,
    topic: `Instant help: ${tags.join(", ")}` || "Instant help",
    tags,
    mode: "instant",
    status: "scheduled",
    startedAt: new Date(Date.now() + 5 * 60 * 1000) // in 5 minutes
  });
  res.json({ sessionId: session.id, hostId: best.id });
});

export default router;
