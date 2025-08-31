import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import { config } from "../config";

const SECRET: Secret = config.jwtSecret as string;

export function signJwt(
  payload: object,
  options: SignOptions = {}
): string {
  return jwt.sign(payload, SECRET, {
    algorithm: "HS256",
    expiresIn: "1d", 
    ...options,
  });
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, SECRET) as T;
  } catch {
    return null;
  }
}
