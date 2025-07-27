import axios from "axios";
import type { AxiosResponse } from "axios";

// Base URL for AI API - uses environment variable or fallback
const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_URL || "https://your-ai-api-endpoint.com";

// Create axios instance with default configuration
const aiApiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
aiApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
aiApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("AI API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

/**
 * Sends a chat message to the AI and returns the response string
 * @param message - The user's message to send to AI
 * @returns Promise<string> - AI's response message
 */
export const getAIChatResponse = async (message: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ response: string }> =
      await aiApiClient.post("/chat", {
        message,
        timestamp: new Date().toISOString(),
      });

    return response.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (status && status >= 500) {
        throw new Error(
          "AI service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Failed to get AI response: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error. Please check your connection and try again.",
    );
  }
};

/**
 * Sends text to the AI to generate voice audio and returns it as a blob
 * @param text - The text to convert to speech
 * @returns Promise<Blob> - Audio blob
 */
export const generateVoice = async (text: string): Promise<Blob> => {
  try {
    const response: AxiosResponse<Blob> = await aiApiClient.post(
      "/generate-voice",
      {
        text,
        voice: "default", // Can be made configurable
        speed: 1.0, // Can be made configurable
      },
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid text provided for voice generation.");
      } else if (status === 413) {
        throw new Error("Text is too long for voice generation.");
      } else if (status && status >= 500) {
        throw new Error("Voice generation service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to generate voice: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error during voice generation. Please try again.");
  }
};

/**
 * Uploads video via FormData for AI-based analysis
 * @param formData - FormData containing the video file and metadata
 * @returns Promise<any> - AI analysis results
 */
export const processVideoAI = async (formData: FormData): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await aiApiClient.post(
      "/process-video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minutes timeout for video processing
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid video format or file too large.");
      } else if (status === 413) {
        throw new Error("Video file is too large. Please use a smaller file.");
      } else if (status === 415) {
        throw new Error(
          "Unsupported video format. Please use MP4, AVI, or MOV.",
        );
      } else if (status && status >= 500) {
        throw new Error("Video processing service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to process video: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error during video processing. Please try again.");
  }
};

/**
 * Sends a fitness goal string and gets motivational or plan-based advice from the AI
 * @param goal - The fitness goal (e.g., "lose weight", "build muscle", "improve endurance")
 * @returns Promise<string> - AI fitness advice
 */
export const getAIFitnessAdvice = async (goal: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ advice: string; plan?: any }> =
      await aiApiClient.post("/fitness-advice", {
        goal,
        userLevel: "intermediate", // Can be made configurable based on user profile
        preferences: {
          workoutDuration: "30-45 minutes",
          frequency: "3-4 times per week",
        },
      });

    return response.data.advice;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid fitness goal provided.");
      } else if (status === 404) {
        throw new Error("No advice available for this fitness goal.");
      } else if (status && status >= 500) {
        throw new Error("Fitness advice service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to get fitness advice: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error while getting fitness advice. Please try again.",
    );
  }
};

// Additional utility functions for enhanced functionality

/**
 * Get AI workout recommendations based on user profile and goals
 * @param userProfile - User's fitness profile and preferences
 * @returns Promise<any> - Workout recommendations
 */
export const getAIWorkoutRecommendations = async (userProfile: {
  fitnessLevel: string;
  goals: string[];
  availableEquipment: string[];
  timeAvailable: number;
}): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await aiApiClient.post(
      "/workout-recommendations",
      userProfile,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to get workout recommendations: ${error.response?.data?.message || error.message}`,
      );
    }
    throw new Error("Network error while getting workout recommendations.");
  }
};

/**
 * Analyze exercise form from video and provide feedback
 * @param exerciseType - Type of exercise being analyzed
 * @param formData - Video data for analysis
 * @returns Promise<any> - Form analysis results
 */
export const analyzeExerciseForm = async (
  exerciseType: string,
  formData: FormData,
): Promise<any> => {
  try {
    formData.append("exerciseType", exerciseType);
    const response: AxiosResponse<any> = await aiApiClient.post(
      "/analyze-form",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 90000, // 1.5 minutes timeout
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to analyze exercise form: ${error.response?.data?.message || error.message}`,
      );
    }
    throw new Error("Network error during form analysis.");
  }
};

// Export the axios instance for custom requests if needed
export { aiApiClient };
