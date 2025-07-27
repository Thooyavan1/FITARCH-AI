import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
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
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "fitarch-user-store", // key for localStorage
    },
  ),
);
