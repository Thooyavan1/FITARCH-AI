export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
