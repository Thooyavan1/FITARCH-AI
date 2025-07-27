import { useAIAssistant } from "../context/AIAssistantContext";
import { useState } from "react";

const FALLBACK_ERROR = "Sorry, something went wrong. Please try again.";

const useAI = () => {
  const { sendMessage, aiResponse, isLoading } = useAIAssistant();
  const [error, setError] = useState<string | null>(null);

  const askAI = async (prompt: string): Promise<string> => {
    setError(null);
    try {
      sendMessage(prompt);
      // Wait for the simulated AI response (2s delay in context)
      await new Promise((resolve) => setTimeout(resolve, 2100));
      if (!aiResponse) {
        throw new Error("No response from AI");
      }
      return aiResponse;
    } catch (e) {
      setError(FALLBACK_ERROR);
      return FALLBACK_ERROR;
    }
  };

  return {
    askAI,
    isAILoading: isLoading,
    error,
  };
};

export default useAI;
