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
export function maybeAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
    const cookieToken = (req as any).cookies?.token;
    const token = bearer || cookieToken;
    if (!token) return next();

    const payload = verifyJwt(token) as { id: string; role?: string } | undefined;
    if (payload?.id) req.user = { id: payload.id, role: payload.role };
  } catch {
  }
  next();
}
