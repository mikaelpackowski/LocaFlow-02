export const PRICE = {
  free: undefined, // plan gratuit → pas de priceId Stripe
  owner: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROPRIETAIRE!,
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!,
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS!,
  enterprise: undefined, // sur devis → pas de Stripe direct
};
