import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface AIAssistantContextProps {
  userMessage: string;
  aiResponse: string;
  isLoading: boolean;
  sendMessage: (message: string) => void;
}

const AIAssistantContext = createContext<AIAssistantContextProps | undefined>(
  undefined,
);

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback((message: string) => {
    setUserMessage(message);
    setIsLoading(true);
    setAIResponse("");
    setTimeout(() => {
      setAIResponse("This is a simulated AI response.");
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <AIAssistantContext.Provider
      value={{ userMessage, aiResponse, isLoading, sendMessage }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error(
      "useAIAssistant must be used within an AIAssistantProvider",
    );
  }
  return context;
}
