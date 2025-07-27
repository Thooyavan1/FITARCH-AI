import axios from "axios";
import type { AxiosResponse } from "axios";

// Declare Razorpay types for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Base URL for payment API - uses environment variable or fallback
const PAYMENT_API_BASE_URL =
  import.meta.env.VITE_PAYMENT_API_URL || "https://your-payment-api.com";

// Payment order interface
interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

// Payment verification data interface
interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Create axios instance with default configuration
const paymentApiClient = axios.create({
  baseURL: PAYMENT_API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
paymentApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
paymentApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Payment API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

/**
 * Creates a payment order for the specified amount
 * @param amount - Amount in INR (Indian Rupees)
 * @returns Promise<any> - Order details from the backend
 */
export const createOrder = async (amount: number): Promise<any> => {
  try {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const response: AxiosResponse<PaymentOrder> = await paymentApiClient.post(
      "/create-order",
      {
        amount: amount * 100, // Convert to paise (Razorpay expects amount in paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`, // Generate unique receipt ID
        notes: {
          source: "fitness-ai-app",
          user_id: localStorage.getItem("userId") || "anonymous",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid amount provided for order creation.");
      } else if (status === 401) {
        throw new Error("Authentication required. Please log in to continue.");
      } else if (status === 402) {
        throw new Error("Payment failed. Please try again.");
      } else if (status && status >= 500) {
        throw new Error(
          "Payment service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Failed to create order: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error. Please check your connection and try again.",
    );
  }
};

/**
 * Verifies the payment using backend logic
 * @param paymentData - Payment verification data from Razorpay
 * @returns Promise<boolean> - True if payment is verified successfully
 */
export const verifyPayment = async (
  paymentData: PaymentVerificationData,
): Promise<boolean> => {
  try {
    if (
      !paymentData.razorpay_order_id ||
      !paymentData.razorpay_payment_id ||
      !paymentData.razorpay_signature
    ) {
      throw new Error("Invalid payment data provided for verification.");
    }

    const response: AxiosResponse<{ verified: boolean; message?: string }> =
      await paymentApiClient.post("/verify-payment", {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      });

    if (!response.data.verified) {
      throw new Error(response.data.message || "Payment verification failed.");
    }

    return response.data.verified;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid payment data provided for verification.");
      } else if (status === 401) {
        throw new Error("Authentication required for payment verification.");
      } else if (status === 409) {
        throw new Error("Payment already processed or order expired.");
      } else if (status && status >= 500) {
        throw new Error(
          "Payment verification service is temporarily unavailable.",
        );
      } else {
        throw new Error(
          `Payment verification failed: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error during payment verification. Please try again.",
    );
  }
};

/**
 * Initializes the Razorpay checkout interface
 * @param order - Order details from createOrder function
 * @param onSuccess - Callback function to execute after successful payment
 */
export const initiateRazorpay = (
  order: PaymentOrder,
  onSuccess: (paymentData: any) => void,
): void => {
  try {
    // Check if Razorpay is loaded
    if (typeof window.Razorpay === "undefined") {
      throw new Error(
        "Razorpay SDK not loaded. Please check your internet connection.",
      );
    }

    // Get user details from localStorage or context
    const userEmail = localStorage.getItem("userEmail") || "";
    const userName = localStorage.getItem("userName") || "";

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
      amount: order.amount,
      currency: order.currency,
      name: "FitArch AI",
      description: "Premium Fitness AI Subscription",
      image: "/logo.png", // Your app logo
      order_id: order.id,
      prefill: {
        name: userName,
        email: userEmail,
        contact: "", // Can be added if available
      },
      notes: {
        source: "fitness-ai-app",
        user_id: localStorage.getItem("userId") || "anonymous",
      },
      theme: {
        color: "#10B981", // Green color for fitness theme
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal dismissed");
        },
      },
      handler: async (response: PaymentVerificationData) => {
        try {
          console.log("Payment successful:", response);

          // Verify the payment
          const isVerified = await verifyPayment(response);

          if (isVerified) {
            // Call the success callback
            onSuccess(response);

            // Update user premium status in localStorage
            localStorage.setItem("isPremium", "true");
            localStorage.setItem(
              "premiumActivatedAt",
              new Date().toISOString(),
            );

            // Show success message
            console.log("Payment verified successfully!");
          } else {
            throw new Error("Payment verification failed.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          alert("Payment verification failed. Please contact support.");
        }
      },
    };

    // Initialize Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error initializing Razorpay:", error);
    alert("Unable to initialize payment. Please try again.");
  }
};

/**
 * Loads the Razorpay SDK dynamically
 * @returns Promise<void> - Resolves when SDK is loaded
 */
export const loadRazorpaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
};

/**
 * Gets payment history for the current user
 * @returns Promise<any[]> - Array of payment transactions
 */
export const getPaymentHistory = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> =
      await paymentApiClient.get("/payment-history");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error("Authentication required to view payment history.");
      } else if (status && status >= 500) {
        throw new Error("Unable to fetch payment history at the moment.");
      } else {
        throw new Error(
          `Failed to fetch payment history: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while fetching payment history.");
  }
};

/**
 * Cancels an active subscription
 * @param subscriptionId - The subscription ID to cancel
 * @returns Promise<boolean> - True if cancellation is successful
 */
export const cancelSubscription = async (
  subscriptionId: string,
): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ cancelled: boolean; message?: string }> =
      await paymentApiClient.post("/cancel-subscription", {
        subscription_id: subscriptionId,
      });

    if (response.data.cancelled) {
      // Update localStorage
      localStorage.setItem("isPremium", "false");
      localStorage.removeItem("premiumActivatedAt");
    }

    return response.data.cancelled;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid subscription ID provided.");
      } else if (status === 401) {
        throw new Error("Authentication required to cancel subscription.");
      } else if (status === 404) {
        throw new Error("Subscription not found.");
      } else if (status && status >= 500) {
        throw new Error("Unable to cancel subscription at the moment.");
      } else {
        throw new Error(
          `Failed to cancel subscription: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while cancelling subscription.");
  }
};

/**
 * Gets available premium plans
 * @returns Promise<any[]> - Array of available plans
 */
export const getPremiumPlans = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> =
      await paymentApiClient.get("/premium-plans");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status && status >= 500) {
        throw new Error("Unable to fetch premium plans at the moment.");
      } else {
        throw new Error(
          `Failed to fetch premium plans: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while fetching premium plans.");
  }
};

// Export the axios instance for custom requests if needed
export { paymentApiClient };
