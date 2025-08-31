import twilio from "twilio";
import { config } from "../config";

export const normalizePhone = (p: string) =>
  p.replace(/[^\d+]/g, ""); 

export const twilioClient = twilio(config.twilio.sid, config.twilio.token);

export async function sendSms(to: string, body: string) {
  const toClean = normalizePhone(to);
  return twilioClient.messages.create({
    to: toClean,
    from: config.twilio.phone,
    body,
  });
}
