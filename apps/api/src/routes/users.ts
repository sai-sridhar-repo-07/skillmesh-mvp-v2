import express from "express";
import { requireAuth } from "../middleware/auth";
import User from "../models/User";

const router = express.Router();

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const allowedFields = ["avatarUrl", "bio", "skills", "tags", "availability"];
    const updates: any = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-passwordHash");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

export default router;
