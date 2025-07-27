import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  // Add more fields as needed
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("fitarch_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = useCallback((user: User) => {
    setUser(user);
    localStorage.setItem("fitarch_user", JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("fitarch_user");
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
