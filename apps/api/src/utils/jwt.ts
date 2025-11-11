import jwt from "jsonwebtoken";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export function signAccess(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: ACCESS_TTL });
}
export function signRefresh(payload: any) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_TTL });
}
export function verifyAccess(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
}
