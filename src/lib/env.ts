/**
 * Centralized Environment Configuration
 */

export const env = {
  // Server-side backend API URL
  backendApiUrl:
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://loadsheddingmanagement-backend.onrender.com/api/v1",

  // Backend API URL (Client & Server accessible)
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://loadsheddingmanagement-backend.onrender.com/api/v1",

  // Base Server URL (for documentation, health, and static resources)
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://loadsheddingmanagement-backend.onrender.com",

  // Stripe Test Publishable Key
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",

  // Environment mode
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;
