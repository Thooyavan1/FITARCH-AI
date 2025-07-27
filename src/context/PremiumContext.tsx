import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";

export type PremiumPlan = 3 | 4 | 5;

interface PremiumContextProps {
  selectedPlan: PremiumPlan | null;
  isPremiumActive: boolean;
  setPlan: (plan: PremiumPlan) => void;
  confirmPlan: () => void;
}

const PremiumContext = createContext<PremiumContextProps | undefined>(
  undefined,
);

export const PremiumProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
  const [isPremiumActive, setIsPremiumActive] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("fitarch_premium_plan");
    if (stored) {
      setSelectedPlan(Number(stored) as PremiumPlan);
      setIsPremiumActive(true);
    }
  }, []);

  const setPlan = useCallback((plan: PremiumPlan) => {
    setSelectedPlan(plan);
    setIsPremiumActive(false);
  }, []);

  const confirmPlan = useCallback(() => {
    if (selectedPlan) {
      localStorage.setItem("fitarch_premium_plan", String(selectedPlan));
      setIsPremiumActive(true);
    }
  }, [selectedPlan]);

  return (
    <PremiumContext.Provider
      value={{ selectedPlan, isPremiumActive, setPlan, confirmPlan }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
}
