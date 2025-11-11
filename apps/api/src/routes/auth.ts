import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt";
import passport from "passport";

const router = express.Router();

/** POST /api/auth/register */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, credits: 0, roles: ["learner"] });
  const accessToken = signAccess({ id: user._id });
  const refreshToken = signRefresh({ id: user._id });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
    accessToken,
    refreshToken,
  });
});

/** POST /api/auth/login */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const accessToken = signAccess({ id: user._id });
  const refreshToken = signRefresh({ id: user._id });
  res.json({
    user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
    accessToken,
    refreshToken,
  });
});

/** POST /api/auth/refresh */
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ message: "refreshToken required" });
  try {
    const decoded = verifyRefresh(refreshToken);
    const accessToken = signAccess({ id: (decoded as any).id });
    const newRefresh = signRefresh({ id: (decoded as any).id });
    res.json({ accessToken, refreshToken: newRefresh });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

/** POST /api/auth/logout (stateless) */
router.post("/logout", (_req, res) => res.json({ success: true }));

/** Google OAuth (kept optional; works when env keys set) */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_ORIGIN}/auth/login` }),
  (_req, res) => res.redirect(`${process.env.CLIENT_ORIGIN}/dashboard`)
);

export default router;
