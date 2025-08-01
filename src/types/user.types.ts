// Basic user profile used across the app
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;       // Optional profile image URL
  isPremium: boolean;       // Flag for premium subscription
  createdAt: Date;          // Account creation date
  updatedAt: Date;          // Last update timestamp
}

// Credentials required during login
export type AuthCredentials = {
  email: string;
  password: string;
};

// Required inputs when registering a new user
export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

// Response returned after successful login
export type LoginResponse = {
  token: string; // JWT or auth token for session
  user: User;    // Complete user object
};

