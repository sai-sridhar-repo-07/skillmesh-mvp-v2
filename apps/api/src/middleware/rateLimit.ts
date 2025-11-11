import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";

const WINDOW = 60; // seconds
const MAX = 100;   // requests per window per ip

const client = new Redis(process.env.REDIS_URL || "");

export async function rateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    const key = `ratelimit:${req.ip}`;
    const now = Math.floor(Date.now() / 1000);
    const ttl = await client.ttl(key);
    const count = await client.incr(key);
    if (ttl === -1) await client.expire(key, WINDOW);
    if (count > MAX) {
      return res.status(429).json({ error: "Too Many Requests" });
    }
    res.setHeader("X-RateLimit-Limit", String(MAX));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, MAX - count)));
    next();
  } catch (e) {
    next(); // be permissive on Redis errors
  }
}
