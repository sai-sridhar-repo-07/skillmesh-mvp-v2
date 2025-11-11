import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message: "Missing Authorization" });
  const token = h.split(" ")[1];
  try {
    const decoded = verifyAccess(token);
    (req as any).user = decoded; // { id: string }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}
