import { useRef, useState, useCallback, useEffect } from "react";

// Helper to get browser-compatible SpeechRecognition
const getSpeechRecognition = (): any => {
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
};

const useVoice = () => {
  const recognitionRef = useRef<any>(null);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognitionConstructor = getSpeechRecognition();
    if (!SpeechRecognitionConstructor) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(event.error || "Speech recognition error");
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const resultText = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      setTranscript(resultText);
    };

    recognitionRef.current = recognition;
    setError(null);
    setTranscript("");
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useVoice;
