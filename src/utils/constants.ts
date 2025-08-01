// 🌐 Base API URL for server requests
export const API_BASE_URL: string = "https://api.fitarch.ai";

// 🌍 Supported language codes for translations
export const SUPPORTED_LANGUAGES: string[] = [
  "en", // English
  "ta", // Tamil
  "hi", // Hindi
  "es", // Spanish
  "fr", // French
  "de", // German
];

// 🖼️ Fallback thumbnail image URL for videos
export const DEFAULT_THUMBNAIL_URL: string =
  "https://fitarch.ai/assets/default-thumbnail.png";

// 📹 Maximum video upload size in MB
export const MAX_VIDEO_UPLOAD_SIZE_MB: number = 500;

// 💎 Premium Plan Interface
export interface PremiumPlan {
  id: string; // Unique plan identifier (e.g., "basic", "pro", "elite")
  name: string; // Display name
  price: number; // Monthly price in USD
  features: string[]; // List of features included
}

// 💰 Premium plans offered in the app
export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: [
      "Access to standard workouts",
      "Basic AI recommendations",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19.99,
    features: [
      "Everything in Basic",
      "Personalized AI coaching",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 29.99,
    features: [
      "Everything in Pro",
      "1-on-1 video sessions",
      "Custom nutrition plans",
      "Early access to new features",
    ],
  },
];
