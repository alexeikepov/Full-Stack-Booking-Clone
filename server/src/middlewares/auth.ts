import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export type AuthedRequest = Request & { user?: { id: string; role?: string } };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = verifyJwt<{ id: string; role?: string }>(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
