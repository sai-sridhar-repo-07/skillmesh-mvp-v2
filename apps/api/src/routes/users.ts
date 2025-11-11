import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { ProfileUpdateDTO } from "../dto";
import User from "../models/User";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const me = await User.findById((req as any).user.id);
  return res.json(me);
});

router.patch("/me", requireAuth, async (req, res) => {
  const parse = ProfileUpdateDTO.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const updated = await User.findByIdAndUpdate((req as any).user.id, parse.data, { new: true });
  return res.json(updated);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

export default router;
