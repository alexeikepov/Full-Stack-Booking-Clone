import jwt from "jsonwebtoken";
import { config } from "../config";

type Payload = { id: string; role?: string };

export function signJwt(payload: Payload, opts?: jwt.SignOptions) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "2h", ...opts });
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, config.jwtSecret) as T;
}
