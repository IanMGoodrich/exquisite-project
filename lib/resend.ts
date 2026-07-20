import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Add PROD key once moving to production
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL_PROD || process.env.RESEND_FROM_EMAIL_DEV
export const YOUR_TURN_EMAIL = process.env.RESEND_YOUR_TURN_EMAIL_PROD ||  process.env.RESEND_YOUR_TURN_EMAIL_DEV