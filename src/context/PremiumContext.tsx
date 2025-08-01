import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type PremiumPlan = 3 | 4 | 5;

interface PremiumContextType {
  selectedPlan: PremiumPlan | null;
  isPremiumActive: boolean;
  setPlan: (plan: PremiumPlan) => void;
  confirmPlan: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
  const [isPremiumActive, setIsPremiumActive] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem("fitarch_premium_plan");
    if (savedPlan) {
      setSelectedPlan(Number(savedPlan) as PremiumPlan);
      setIsPremiumActive(true);
    }
  }, []);

  const setPlan = useCallback((plan: PremiumPlan) => {
    setSelectedPlan(plan);
    setIsPremiumActive(false);
  }, []);

  const confirmPlan = useCallback(() => {
    if (selectedPlan) {
      localStorage.setItem("fitarch_premium_plan", selectedPlan.toString());
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

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
