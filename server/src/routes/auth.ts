import { Router } from "express";
import { UserModel } from "../models/User";
import { signJwt } from "../utils/jwt";

const router = Router();

// OTP storage (in-memory). For production, use Redis/DB with TTL.
const codeStore = new Map<string, { code: string; expiresAt: number }>();

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const nowMs = () => Date.now();
const FIVE_MIN = 5 * 60 * 1000;

function normalizePhone(raw: string): string {
  const s = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+")) return `+${s}`;
  if (/^0\d{8,10}$/.test(s)) return `+972${s.substring(1)}`;
  if (/^\d{6,15}$/.test(s)) return `+${s}`;
  return raw.trim();
}

router.post("/otp/request", async (req, res) => {
  const { phone } = req.body ?? {};
  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ error: "phone required" });
  }
  try {
    const p = normalizePhone(phone);
    const code = generateCode();
    codeStore.set(p, { code, expiresAt: nowMs() + FIVE_MIN });

    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } =
      process.env as Record<string, string | undefined>;

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER) {
      // Lazy-require Twilio only when configured
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const twilio = require("twilio");
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: TWILIO_FROM_NUMBER,
        to: p,
        body: `Your verification code is ${code}`,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("OTP request failed:", e);
    return res.status(500).json({ error: "Failed to send code" });
  }
});

router.post("/otp/verify", async (req, res) => {
  const { phone, code } = req.body ?? {};
  if (!phone || !code) {
    return res.status(400).json({ error: "phone and code required" });
  }
  const p = normalizePhone(String(phone));
  const entry = codeStore.get(p);
  if (!entry) {
    return res.status(400).json({ error: "No code requested" });
  }
  if (entry.expiresAt < nowMs()) {
    codeStore.delete(p);
    return res.status(400).json({ error: "Code expired" });
  }
  if (entry.code !== String(code).trim()) {
    return res.status(400).json({ error: "Invalid code" });
  }

  codeStore.delete(p);

  // Link to real user by phone for login; be tolerant to formats
  // Match by normalized phone OR last 8-10 digits suffix to handle stored variants
  const suffix = p.replace(/\D/g, "").slice(-9); // e.g., 522222689
  const altSuffix10 = p.replace(/\D/g, "").slice(-10);
  const user = await UserModel.findOne({
    $or: [
      { phone: p },
      { phone: String(phone) },
      { phone: new RegExp(`${suffix}$`) },
      { phone: new RegExp(`${altSuffix10}$`) },
    ],
  });
  if (!user) {
    return res.status(404).json({
      error: "User with this phone was not found. Please register first.",
    });
  }
  const token = signJwt({ id: user.id, role: user.role }, { expiresIn: "2h" });
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  });
});

export default router;
