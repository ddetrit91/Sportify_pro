import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.warn("⚠️ STRIPE_SECRET_KEY is not defined in environment variables.");
}

export const stripe = new Stripe(secretKey || "sk_test_placeholder_key_for_build_only", {
  apiVersion: "2025-02-24.acacia" as any,
  typescript: true,
});
