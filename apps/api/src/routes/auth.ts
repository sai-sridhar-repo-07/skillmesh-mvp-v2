import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { RegisterDTO, LoginDTO } from "../dto";
import User from "../models/User";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt";

const router = Router();

router.post("/register", async (req, res) => {
  const parse = RegisterDTO.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { name, email, password } = parse.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already registered" });
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash: hash, roles: ["learner"] });
  const access = signAccess({ id: user.id, email, roles: user.roles });
  const refresh = signRefresh({ id: user.id });
  return res.json({ user: { id: user.id, name, email }, accessToken: access, refreshToken: refresh });
});

router.post("/login", async (req, res) => {
  const parse = LoginDTO.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const access = signAccess({ id: user.id, email, roles: user.roles });
  const refresh = signRefresh({ id: user.id });
  return res.json({ user: { id: user.id, name: user.name, email }, accessToken: access, refreshToken: refresh });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: "Missing refreshToken" });
  try {
    const payload = verifyRefresh(refreshToken) as any;
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });
    const access = signAccess({ id: user.id, email: user.email, roles: user.roles });
    return res.json({ accessToken: access });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  return res.json({ ok: true });
});

export default router;

import passport from "../passport";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: process.env.CLIENT_ORIGIN }),
  async (req, res) => {
    const user: any = (req as any).user;
    const access = signAccess({ id: user.id, email: user.email, roles: user.roles });
    const refresh = signRefresh({ id: user.id });
    const redirect = new URL(process.env.CLIENT_ORIGIN!);
    redirect.pathname = "/dashboard";
    redirect.searchParams.set("accessToken", access);
    redirect.searchParams.set("refreshToken", refresh);
    res.redirect(redirect.toString());
  }
);
