export const API_BASE_URL: string = "https://api.fitarch.ai";

export const SUPPORTED_LANGUAGES: string[] = [
  "en",
  "ta",
  "hi",
  "es",
  "fr",
  "de",
];

export const DEFAULT_THUMBNAIL_URL: string =
  "https://fitarch.ai/assets/default-thumbnail.png";

export const MAX_VIDEO_UPLOAD_SIZE_MB: number = 500;

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

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
