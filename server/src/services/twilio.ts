import twilio from "twilio";
import { config } from "../config";

export const normalizePhone = (p: string) => p.replace(/[^\d+]/g, "");

function assertTwilio() {
  const { sid, token, phone } = config.twilio;
  if (!sid || !token || !phone) {
    throw new Error("Twilio config is missing. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER");
  }
}

// Call only if you actually use SMS features:
export function getTwilioClient() {
  assertTwilio();
  return twilio(config.twilio.sid, config.twilio.token);
}
