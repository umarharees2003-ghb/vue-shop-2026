import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
// Replace with your Stripe publishable key
// Get it from: Stripe Dashboard → Developers → API Keys

const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Payment intent creation
// In a real app, this would call your backend to create a PaymentIntent
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
}

export const createPaymentIntent = async (amount: number): Promise<PaymentIntent> => {
  // In production, call your backend API:
  // const response = await fetch('/api/create-payment-intent', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ amount })
  // });
  // return response.json();

  // For demo purposes, return mock data
  // In real implementation, replace with actual backend call
  return {
    clientSecret: 'pi_mock_client_secret_' + Date.now(),
    amount
  };
};

// To set up Stripe:
// 1. Go to https://dashboard.stripe.com/
// 2. Create a Stripe account (or sign in)
// 3. Get your API keys from Developers → API keys
// 4. Enable Stripe in test mode for development
// 5. For production, use your live API keys