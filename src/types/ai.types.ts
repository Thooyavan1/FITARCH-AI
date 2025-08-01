// Type for a single AI message (used in chat or logs)
export interface AIResponse {
  message: string;
  timestamp?: Date; // Optional timestamp for tracking
}

// Type for voice commands recognized by the AI
export type VoiceCommand = {
  command: string;
  confidence: number; // Confidence score from voice recognition model (0 to 1)
  triggeredAction?: string; // Optional mapped action (e.g., "startWorkout", "playVideo")
};

// Type for the AI's state in the app (context state management)
export interface AIContextState {
  isSpeaking: boolean; // Whether AI is currently talking
  isListening: boolean; // Whether AI is actively listening to user
  aiMessages: AIResponse[]; // Conversation history (AI side)
  currentCommand: VoiceCommand | null; // Latest voice command detected
}
