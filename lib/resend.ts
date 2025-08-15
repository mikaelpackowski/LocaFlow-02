// lib/resend.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_EMAIL = process.env.ALERTS_FROM_EMAIL!;
export const FALLBACK_TO = process.env.ALERTS_FALLBACK_TO || "";
