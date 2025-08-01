import axios from "axios";
import type { AxiosResponse } from "axios";

// ===================
// Config
// ===================
const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_URL || "https://your-ai-api-endpoint.com";

const aiApiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================
// Interceptors
// ===================
// Add auth token
aiApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
aiApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("AI API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ===================
// Chat with AI
// ===================
export const getAIChatResponse = async (message: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ response: string }> = await aiApiClient.post("/chat", {
      message,
      timestamp: new Date().toISOString(),
    });
    return response.data.response;
  } catch (error) {
    return handleAxiosError(error, "get AI response");
  }
};

// ===================
// Text-to-Speech
// ===================
export const generateVoice = async (text: string): Promise<Blob> => {
  try {
    const response: AxiosResponse<Blob> = await aiApiClient.post(
      "/generate-voice",
      { text, voice: "default", speed: 1.0 },
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    return handleAxiosError(error, "generate voice");
  }
};

// ===================
// Video Upload
// ===================
export const processVideoAI = async (formData: FormData): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await aiApiClient.post("/process-video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error, "process video");
  }
};

// ===================
// Fitness Advice
// ===================
export const getAIFitnessAdvice = async (goal: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ advice: string }> = await aiApiClient.post("/fitness-advice", {
      goal,
      userLevel: "intermediate",
      preferences: {
        workoutDuration: "30-45 minutes",
        frequency: "3-4 times per week",
      },
    });
    return response.data.advice;
  } catch (error) {
    return handleAxiosError(error, "get fitness advice");
  }
};

// ===================
// Workout Recommendations
// ===================
export const getAIWorkoutRecommendations = async (userProfile: {
  fitnessLevel: string;
  goals: string[];
  availableEquipment: string[];
  timeAvailable: number;
}): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await aiApiClient.post("/workout-recommendations", userProfile);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "get workout recommendations");
  }
};

// ===================
// Exercise Form Analysis
// ===================
export const analyzeExerciseForm = async (
  exerciseType: string,
  formData: FormData
): Promise<any> => {
  try {
    formData.append("exerciseType", exerciseType);
    const response: AxiosResponse<any> = await aiApiClient.post("/analyze-form", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 90000,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "analyze exercise form");
  }
};

// ===================
// Shared Error Handler
// ===================
const handleAxiosError = (error: any, context: string): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        throw new Error(`Bad Request (${context}): ${message}`);
      case 401:
        throw new Error(`Unauthorized (${context}). Please login again.`);
      case 404:
        throw new Error(`Not Found (${context}): ${message}`);
      case 413:
        throw new Error(`Payload too large (${context}).`);
      case 415:
        throw new Error(`Unsupported Media Type (${context}).`);
      case 429:
        throw new Error(`Rate limited (${context}). Please try again later.`);
      default:
        if (status && status >= 500) {
          throw new Error(`Server error (${context}). Try again later.`);
        }
        throw new Error(`Error (${context}): ${message}`);
    }
  } else {
    throw new Error(`Network error (${context}). Please check your connection.`);
  }
};

// ===================
// Export Axios Instance
// ===================
export { aiApiClient };
