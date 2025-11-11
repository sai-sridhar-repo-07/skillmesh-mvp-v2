import express from "express";
import User from "../models/User";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).user.id;
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json(user);
});

export default router;
