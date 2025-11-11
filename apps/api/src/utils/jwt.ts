import jwt from "jsonwebtoken";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export const signAccess = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: ACCESS_TTL });

export const signRefresh = (payload: object) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_TTL });

export const verifyAccess = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!) as any;

export const verifyRefresh = (token: string) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;
