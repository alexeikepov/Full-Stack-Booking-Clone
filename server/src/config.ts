import "dotenv/config";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: req("JWT_SECRET"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/booking",
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID ?? "",
    token: process.env.TWILIO_AUTH_TOKEN ?? "",
    phone: process.env.TWILIO_PHONE_NUMBER ?? "",
  },
} as const;
