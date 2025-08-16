// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Soit tu fixes une version officiellement supportée :
  apiVersion: "2024-06-20",
  // Soit tu supprimes apiVersion pour utiliser celle par défaut de ton compte :
  // apiVersion: undefined,
});
