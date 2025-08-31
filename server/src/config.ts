export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/booking",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-replace-me",
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID || "",
    token: process.env.TWILIO_AUTH_TOKEN || "",
    phone: process.env.TWILIO_PHONE_NUMBER || "",
  },
} as const;
