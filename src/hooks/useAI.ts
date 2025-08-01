import { useAIAssistant } from "../context/AIAssistantContext";
import { useState, useEffect } from "react";

const FALLBACK_ERROR = "Sorry, something went wrong. Please try again.";

const useAI = () => {
  const { sendMessage, aiResponse, isLoading } = useAIAssistant();
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  const askAI = async (prompt: string): Promise<string> => {
    setError(null);
    setResponse(""); // reset old response
    try {
      sendMessage(prompt);
      // Wait for the AI to respond (based on the delay used in context)
      await new Promise((resolve) => setTimeout(resolve, 2500)); // Adjust if needed
      if (!aiResponse) throw new Error("No response from AI");
      setResponse(aiResponse);
      return aiResponse;
    } catch (e) {
      setError(FALLBACK_ERROR);
      setResponse(FALLBACK_ERROR);
      return FALLBACK_ERROR;
    }
  };

  // Optional: Keep response updated if context value changes
  useEffect(() => {
    if (aiResponse) {
      setResponse(aiResponse);
    }
  }, [aiResponse]);

  return {
    askAI,
    isAILoading: isLoading,
    error,
    response,
  };
};

export default useAI;
