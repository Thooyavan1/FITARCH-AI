import axios from "axios";
import type { AxiosResponse } from "axios";

// Base URL for user API - uses environment variable or fallback
const USER_API_BASE_URL =
  import.meta.env.VITE_USER_API_URL || "https://your-api.com";

// User data interfaces
interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  goals?: string[];
  age?: number;
  weight?: number;
  height?: number;
}

interface UserLoginCredentials {
  email: string;
  password: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  fitnessLevel: string;
  goals: string[];
  age?: number;
  weight?: number;
  height?: number;
  isPremium: boolean;
  premiumActivatedAt?: string;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  preferences?: {
    workoutDuration: string;
    frequency: string;
    equipment: string[];
  };
}

interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

// Create axios instance with default configuration
const userApiClient = axios.create({
  baseURL: USER_API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
userApiClient.interceptors.request.use(
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
userApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("User API Error:", error.response?.data || error.message);

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      // Redirect to login page if needed
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

/**
 * Registers a new user
 * @param userData - User registration data
 * @returns Promise<any> - Registration response with user data and token
 */
export const registerUser = async (
  userData: UserRegistrationData,
): Promise<any> => {
  try {
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error("Name, email, and password are required.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Please enter a valid email address.");
    }

    // Validate password strength
    if (userData.password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // Validate password confirmation if provided
    if (
      userData.confirmPassword &&
      userData.password !== userData.confirmPassword
    ) {
      throw new Error("Passwords do not match.");
    }

    const response: AxiosResponse<AuthResponse> = await userApiClient.post(
      "/register",
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        fitnessLevel: userData.fitnessLevel || "beginner",
        goals: userData.goals || [],
        age: userData.age,
        weight: userData.weight,
        height: userData.height,
      },
    );

    // Store authentication data
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userEmail", response.data.user.email);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userId", response.data.user.id);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error(
          error.response?.data?.message ||
            "Invalid registration data provided.",
        );
      } else if (status === 409) {
        throw new Error("User with this email already exists.");
      } else if (status === 422) {
        throw new Error("Validation failed. Please check your input.");
      } else if (status && status >= 500) {
        throw new Error(
          "Registration service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Registration failed: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error. Please check your connection and try again.",
    );
  }
};

/**
 * Logs in a user with email and password
 * @param credentials - User login credentials
 * @returns Promise<any> - Login response with user data and token
 */
export const loginUser = async (
  credentials: UserLoginCredentials,
): Promise<any> => {
  try {
    // Validate required fields
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error("Please enter a valid email address.");
    }

    const response: AxiosResponse<AuthResponse> = await userApiClient.post(
      "/login",
      {
        email: credentials.email,
        password: credentials.password,
      },
    );

    // Store authentication data
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userEmail", response.data.user.email);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem(
        "isPremium",
        response.data.user.isPremium.toString(),
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid email or password.");
      } else if (status === 401) {
        throw new Error(
          "Invalid credentials. Please check your email and password.",
        );
      } else if (status === 403) {
        throw new Error("Account is disabled. Please contact support.");
      } else if (status && status >= 500) {
        throw new Error(
          "Login service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Login failed: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error. Please check your connection and try again.",
    );
  }
};

/**
 * Logs out the current user by clearing local storage
 */
export const logoutUser = (): void => {
  try {
    // Clear all authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("isPremium");
    localStorage.removeItem("premiumActivatedAt");

    // Clear any other user-related data
    sessionStorage.clear();

    // Optional: Clear cookies if any
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

/**
 * Fetches the authenticated user's profile
 * @param token - Authentication token (optional, will use stored token if not provided)
 * @returns Promise<any> - User profile data
 */
export const getUserProfile = async (token?: string): Promise<any> => {
  try {
    const authToken = token || localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found. Please log in.");
    }

    const response: AxiosResponse<UserProfile> = await userApiClient.get(
      "/profile",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    // Update stored user data
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("userEmail", response.data.email);
    localStorage.setItem("userName", response.data.name);
    localStorage.setItem("userId", response.data.id);
    localStorage.setItem("isPremium", response.data.isPremium.toString());

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to view this profile.",
        );
      } else if (status === 404) {
        throw new Error("User profile not found.");
      } else if (status && status >= 500) {
        throw new Error(
          "Profile service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Failed to fetch profile: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error. Please check your connection and try again.",
    );
  }
};

/**
 * Updates the user's profile
 * @param profileData - Updated profile data
 * @returns Promise<any> - Updated user profile
 */
export const updateUserProfile = async (
  profileData: Partial<UserProfile>,
): Promise<any> => {
  try {
    const response: AxiosResponse<UserProfile> = await userApiClient.put(
      "/profile",
      profileData,
    );

    // Update stored user data
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("userName", response.data.name);
    localStorage.setItem("isPremium", response.data.isPremium.toString());

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid profile data provided.");
      } else if (status === 401) {
        throw new Error("Authentication required to update profile.");
      } else if (status === 422) {
        throw new Error("Validation failed. Please check your input.");
      } else if (status && status >= 500) {
        throw new Error("Profile update service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to update profile: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while updating profile.");
  }
};

/**
 * Changes the user's password
 * @param currentPassword - Current password
 * @param newPassword - New password
 * @returns Promise<boolean> - True if password change is successful
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required.");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }

    const response: AxiosResponse<{ success: boolean; message?: string }> =
      await userApiClient.post("/change-password", {
        currentPassword,
        newPassword,
      });

    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid password data provided.");
      } else if (status === 401) {
        throw new Error("Current password is incorrect.");
      } else if (status === 422) {
        throw new Error("New password does not meet requirements.");
      } else if (status && status >= 500) {
        throw new Error("Password change service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to change password: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while changing password.");
  }
};

/**
 * Requests a password reset
 * @param email - User's email address
 * @returns Promise<boolean> - True if reset email is sent successfully
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    if (!email) {
      throw new Error("Email address is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const response: AxiosResponse<{ success: boolean; message?: string }> =
      await userApiClient.post("/forgot-password", {
        email,
      });

    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        throw new Error("No account found with this email address.");
      } else if (status === 429) {
        throw new Error("Too many reset requests. Please try again later.");
      } else if (status && status >= 500) {
        throw new Error("Password reset service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to request password reset: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while requesting password reset.");
  }
};

/**
 * Resets password using reset token
 * @param token - Reset token from email
 * @param newPassword - New password
 * @returns Promise<boolean> - True if password reset is successful
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    if (!token || !newPassword) {
      throw new Error("Reset token and new password are required.");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }

    const response: AxiosResponse<{ success: boolean; message?: string }> =
      await userApiClient.post("/reset-password", {
        token,
        newPassword,
      });

    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid reset token or password.");
      } else if (status === 401) {
        throw new Error("Reset token is invalid or expired.");
      } else if (status && status >= 500) {
        throw new Error("Password reset service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to reset password: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while resetting password.");
  }
};

/**
 * Refreshes the authentication token
 * @returns Promise<string> - New access token
 */
export const refreshAuthToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    const response: AxiosResponse<{ token: string; expiresIn: number }> =
      await userApiClient.post("/refresh-token", {
        refreshToken,
      });

    // Update stored token
    localStorage.setItem("authToken", response.data.token);

    return response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        // Refresh token is invalid, logout user
        logoutUser();
        throw new Error("Session expired. Please log in again.");
      } else if (status && status >= 500) {
        throw new Error("Token refresh service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to refresh token: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while refreshing token.");
  }
};

/**
 * Checks if user is currently authenticated
 * @returns boolean - True if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

/**
 * Gets current user data from localStorage
 * @returns UserProfile | null - Current user data or null if not authenticated
 */
export const getCurrentUser = (): UserProfile | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Export the axios instance for custom requests if needed
export { userApiClient };
