import axios from "axios";
import type { AxiosResponse } from "axios";

// Base URL
const USER_API_BASE_URL = import.meta.env.VITE_USER_API_URL || "https://your-api.com";

// Interfaces
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

// Axios instance
const userApiClient = axios.create({
  baseURL: USER_API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Interceptors
userApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

userApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("User API Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      logoutUser();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Register
export const registerUser = async (userData: UserRegistrationData): Promise<any> => {
  try {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error("Name, email, and password are required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) throw new Error("Invalid email.");

    if (userData.password.length < 6) throw new Error("Password too short.");

    if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const response: AxiosResponse<AuthResponse> = await userApiClient.post("/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      fitnessLevel: userData.fitnessLevel || "beginner",
      goals: userData.goals || [],
      age: userData.age,
      weight: userData.weight,
      height: userData.height,
    });

    const { token, refreshToken, user } = response.data;
    localStorage.setItem("authToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userId", user.id);

    return response.data;
  } catch (error) {
    return handleAxiosError(error, "Registration");
  }
};

// Login
export const loginUser = async (credentials: UserLoginCredentials): Promise<any> => {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) throw new Error("Invalid email format.");

    const response: AxiosResponse<AuthResponse> = await userApiClient.post("/login", credentials);

    const { token, refreshToken, user } = response.data;
    localStorage.setItem("authToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isPremium", user.isPremium.toString());

    return response.data;
  } catch (error) {
    return handleAxiosError(error, "Login");
  }
};

// Logout
export const logoutUser = (): void => {
  try {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.log("User logged out.");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Get user profile
export const getUserProfile = async (token?: string): Promise<UserProfile> => {
  try {
    const authToken = token || localStorage.getItem("authToken");
    if (!authToken) throw new Error("Authentication required.");

    const response: AxiosResponse<UserProfile> = await userApiClient.get("/profile", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const user = response.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isPremium", user.isPremium.toString());

    return user;
  } catch (error) {
    return handleAxiosError(error, "Fetching profile");
  }
};

// Update profile
export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response: AxiosResponse<UserProfile> = await userApiClient.put("/profile", profileData);
    const updated = response.data;
    localStorage.setItem("user", JSON.stringify(updated));
    localStorage.setItem("userName", updated.name);
    localStorage.setItem("isPremium", updated.isPremium.toString());
    return updated;
  } catch (error) {
    return handleAxiosError(error, "Updating profile");
  }
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    if (!currentPassword || !newPassword) throw new Error("Password fields are required.");
    if (newPassword.length < 6) throw new Error("New password must be at least 6 characters.");

    const response = await userApiClient.post("/change-password", { currentPassword, newPassword });
    return response.data.success;
  } catch (error) {
    return handleAxiosError(error, "Changing password");
  }
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    if (!email) throw new Error("Email is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Invalid email.");

    const response = await userApiClient.post("/forgot-password", { email });
    return response.data.success;
  } catch (error) {
    return handleAxiosError(error, "Password reset request");
  }
};

// Reset password
export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    if (!token || !newPassword) throw new Error("Token and password required.");
    if (newPassword.length < 6) throw new Error("Password too short.");

    const response = await userApiClient.post("/reset-password", { token, newPassword });
    return response.data.success;
  } catch (error) {
    return handleAxiosError(error, "Resetting password");
  }
};

// Refresh token
export const refreshAuthToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token.");

    const response = await userApiClient.post("/refresh-token", { refreshToken });
    localStorage.setItem("authToken", response.data.token);
    return response.data.token;
  } catch (error) {
    return handleAxiosError(error, "Refreshing token");
  }
};

// Auth check
export const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem("authToken") && localStorage.getItem("user"));
};

// Get current user
export const getCurrentUser = (): UserProfile | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("User parse error:", error);
    return null;
  }
};

// Utility for handling errors
const handleAxiosError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 400) throw new Error(`${context}: Bad request.`);
    if (status === 401) throw new Error(`${context}: Unauthorized.`);
    if (status === 403) throw new Error(`${context}: Forbidden.`);
    if (status === 404) throw new Error(`${context}: Not found.`);
    if (status === 422) throw new Error(`${context}: Validation error.`);
    if (status && status >= 500) throw new Error(`${context}: Server error.`);

    throw new Error(`${context} failed: ${message}`);
  }
  throw new Error(`${context}: Network error.`);
};

// Export axios if needed
export { userApiClient };
