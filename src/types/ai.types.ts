export interface AIResponse {
  message: string;
  timestamp?: Date;
}

export type VoiceCommand = {
  command: string;
  confidence: number;
  triggeredAction?: string;
};

export interface AIContextState {
  isSpeaking: boolean;
  isListening: boolean;
  aiMessages: AIResponse[];
  currentCommand: VoiceCommand | null;
}
