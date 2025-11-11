import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { SessionCreateDTO } from "../dto";
import Session from "../models/Session";
import User from "../models/User";
import { nanoid } from "nanoid";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const parse = SessionCreateDTO.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const hostId = (req as any).user.id;
  const session = await Session.create({ ...parse.data, hostId });
  res.status(201).json(session);
});

router.get("/discover", async (req, res) => {
  const { q, tags, mode, status } = req.query as any;
  const filter: any = {};
  if (q) filter.topic = { $regex: q, $options: "i" };
  if (tags) filter.tags = { $in: String(tags).split(",") };
  if (mode) filter.mode = mode;
  if (status) filter.status = status;
  const items = await Session.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(items);
});

router.post("/:id/join", requireAuth, async (req, res) => {
  const s = await Session.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  const userId = (req as any).user.id;
  if (s.participants.find(p => String(p.userId) === userId)) return res.json(s);
  if (s.participants.length >= s.maxParticipants) return res.status(400).json({ error: "Full" });
  s.participants.push({ userId, joinedAt: new Date(), leftAt: null as any });
  await s.save();
  res.json(s);
});

router.post("/:id/start", requireAuth, async (req, res) => {
  const s = await Session.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  if (String(s.hostId) !== (req as any).user.id) return res.status(403).json({ error: "Forbidden" });
  s.status = "live";
  s.startedAt = new Date();
  s.signalingRoomId = `session:${s.id}`;
  s.whiteboardRoomId = `whiteboard:${s.id}`;
  await s.save();
  res.json({ session: s, signalingRoomId: s.signalingRoomId, whiteboardRoomId: s.whiteboardRoomId });
});

router.post("/:id/end", requireAuth, async (req, res) => {
  const s = await Session.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  if (String(s.hostId) !== (req as any).user.id) return res.status(403).json({ error: "Forbidden" });
  s.status = "completed";
  s.endedAt = new Date();
  await s.save();
  res.json(s);
});

router.post("/:id/cancel", requireAuth, async (req, res) => {
  const s = await Session.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  if (String(s.hostId) !== (req as any).user.id) return res.status(403).json({ error: "Forbidden" });
  s.status = "cancelled";
  await s.save();
  res.json(s);
});

router.get("/:id", async (req, res) => {
  const s = await Session.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  res.json(s);
});

router.get("/me/hosted/list", requireAuth, async (req, res) => {
  const items = await Session.find({ hostId: (req as any).user.id }).sort({ createdAt: -1 });
  res.json(items);
});

export default router;
