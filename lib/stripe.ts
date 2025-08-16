// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Version stable supportée par le SDK
  apiVersion: "2024-06-20",
});
