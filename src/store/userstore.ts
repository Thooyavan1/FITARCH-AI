// E:\fitarch-ai-app\src\store\userstore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// You can customize this User interface to match your actual user object structure
interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  role?: string;
  premium?: boolean;
}

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user: User) => set({ user }),
      setToken: (token: string) => set({ token }),
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'fitarch-user-store', // key used in localStorage
    }
  )
);
