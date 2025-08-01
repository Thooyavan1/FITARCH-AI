import axios from "axios";
import type { AxiosResponse } from "axios";

// ==========================
// Global Declaration
// ==========================
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ==========================
// Constants & Interfaces
// ==========================
const PAYMENT_API_BASE_URL =
  import.meta.env.VITE_PAYMENT_API_URL || "https://your-payment-api.com";

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ==========================
// Axios Instance
// ==========================
const paymentApiClient = axios.create({
  baseURL: PAYMENT_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

paymentApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

paymentApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Payment API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==========================
// Error Handling Utility
// ==========================
const handlePaymentError = (error: any, context: string): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        throw new Error(`Bad request during ${context}.`);
      case 401:
        throw new Error(`Authentication required for ${context}.`);
      case 402:
        throw new Error(`Payment failed during ${context}.`);
      case 404:
        throw new Error(`Resource not found during ${context}.`);
      case 409:
        throw new Error(`Conflict detected during ${context}.`);
      default:
        if (status && status >= 500) {
          throw new Error(`Server error during ${context}. Try again later.`);
        }
        throw new Error(`Error during ${context}: ${message}`);
    }
  }

  throw new Error(`Network error during ${context}. Please try again.`);
};

// ==========================
// Core API Services
// ==========================

export const createOrder = async (amount: number): Promise<PaymentOrder> => {
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  try {
    const response: AxiosResponse<PaymentOrder> = await paymentApiClient.post("/create-order", {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        source: "fitness-ai-app",
        user_id: localStorage.getItem("userId") || "anonymous",
      },
    });

    return response.data;
  } catch (error: any) {
    return handlePaymentError(error, "create order");
  }
};

export const verifyPayment = async (
  paymentData: PaymentVerificationData
): Promise<boolean> => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Invalid payment data provided for verification.");
  }

  try {
    const response: AxiosResponse<{ verified: boolean; message?: string }> =
      await paymentApiClient.post("/verify-payment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

    if (!response.data.verified) {
      throw new Error(response.data.message || "Payment verification failed.");
    }

    return true;
  } catch (error: any) {
    return handlePaymentError(error, "verify payment");
  }
};

export const initiateRazorpay = (
  order: PaymentOrder,
  onSuccess: (paymentData: PaymentVerificationData) => void
): void => {
  if (typeof window.Razorpay === "undefined") {
    alert("Razorpay SDK not loaded. Check your internet connection.");
    return;
  }

  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "FitArch AI",
    description: "Premium Fitness AI Subscription",
    image: "/logo/logo.png",
    order_id: order.id,
    prefill: {
      name: userName,
      email: userEmail,
      contact: "",
    },
    notes: {
      source: "fitness-ai-app",
      user_id: localStorage.getItem("userId") || "anonymous",
    },
    theme: {
      color: "#10B981",
    },
    modal: {
      ondismiss: () => console.log("Payment modal dismissed"),
    },
    handler: async (response: PaymentVerificationData) => {
      try {
        const isVerified = await verifyPayment(response);
        if (isVerified) {
          localStorage.setItem("isPremium", "true");
          localStorage.setItem("premiumActivatedAt", new Date().toISOString());
          onSuccess(response);
          console.log("Payment verified successfully!");
        } else {
          throw new Error("Payment verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        alert("Payment verification failed. Please contact support.");
      }
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

export const loadRazorpaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
};

export const getPaymentHistory = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await paymentApiClient.get("/payment-history");
    return response.data;
  } catch (error: any) {
    return handlePaymentError(error, "fetch payment history");
  }
};

export const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ cancelled: boolean }> = await paymentApiClient.post(
      "/cancel-subscription",
      { subscription_id: subscriptionId }
    );

    if (response.data.cancelled) {
      localStorage.setItem("isPremium", "false");
      localStorage.removeItem("premiumActivatedAt");
    }

    return response.data.cancelled;
  } catch (error: any) {
    return handlePaymentError(error, "cancel subscription");
  }
};

export const getPremiumPlans = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await paymentApiClient.get("/premium-plans");
    return response.data;
  } catch (error: any) {
    return handlePaymentError(error, "fetch premium plans");
  }
};

// ==========================
// Export Axios Instance
// ==========================
export { paymentApiClient };
