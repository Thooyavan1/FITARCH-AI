import React, { useRef, useState } from "react";

// Type for a message in the chat
interface Message {
  sender: "user" | "ai";
  text: string;
}

const VoiceAssistant: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  // TypeScript compatibility for SpeechRecognition API
  // @ts-ignore
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const recognitionRef = useRef<any>(null);

  // Start speech recognition
  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessages((prev) => [...prev, { sender: "user", text: transcript }]);
      // Simulate AI reply
      setTimeout(() => {
        const aiReply = "Working on it...";
        setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
        // Speak the AI reply
        speak(aiReply);
      }, 1000);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Speak a message using Web Speech API
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-4 h-64 overflow-y-auto bg-gray-900 rounded-lg p-4 shadow-inner flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center">
            Start a conversation with your AI assistant!
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
              msg.sender === "user"
                ? "bg-primary text-white self-end"
                : "bg-gray-800 text-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={startListening}
          disabled={listening}
          className={`rounded-full p-4 bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none transition flex items-center justify-center ${
            listening ? "animate-pulse opacity-70" : ""
          }`}
          aria-label="Activate voice assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 11-6 0V7a3 3 0 016 0v5z"
            />
          </svg>
        </button>
      </div>
      {listening && (
        <div className="text-center text-primary mt-2 animate-pulse">
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
