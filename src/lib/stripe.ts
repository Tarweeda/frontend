import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { env } from '../config/env';

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(env.stripePublishableKey);
  }
  return stripePromise;
}
