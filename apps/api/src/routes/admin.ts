import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import User from "../models/User";
import Session from "../models/Session";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/stats", async (_req, res) => {
  const users = await User.countDocuments();
  const sessions = await Session.countDocuments();
  res.json({ users, sessions });
});

export default router;
