import { useRef, useState, useCallback, useEffect } from "react";

const getSpeechRecognition = () => {
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
};

const useVoice = () => {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => {
      setError(e.error || "Speech recognition error");
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const result = Array.from(event.results)
        .map((res: any) => res[0].transcript)
        .join(" ");
      setTranscript(result);
    };
    recognitionRef.current = recognition;
    setError(null);
    setTranscript("");
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

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
