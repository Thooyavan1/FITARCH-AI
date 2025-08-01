// src/api/videoApi.ts

import axios, { AxiosResponse } from "axios";

// Base URL from environment or fallback
const VIDEO_API_BASE_URL =
  import.meta.env.VITE_VIDEO_API_URL || "https://your-api.com";

// -----------------------------
// Interfaces
// -----------------------------

export interface VideoData {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  size: number;
  format: string;
  userId: string;
  isProcessed: boolean;
  aiAnalysis?: {
    exerciseType?: string;
    formScore?: number;
    feedback?: string[];
    recommendations?: string[];
    processedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UploadResponse {
  success: boolean;
  video: VideoData;
  message?: string;
}

interface VideoListResponse {
  videos: VideoData[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

// -----------------------------
// Axios Client
// -----------------------------

const videoApiClient = axios.create({
  baseURL: VIDEO_API_BASE_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

videoApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

videoApiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Video API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  },
);

// -----------------------------
// API Functions
// -----------------------------

export const uploadVideo = async (
  formData: FormData,
  token: string,
): Promise<UploadResponse> => {
  const file = formData.get("video") as File;
  if (!file) throw new Error("No video file provided.");
  if (file.size > 100 * 1024 * 1024)
    throw new Error("Video file must be less than 100MB.");
  if (!file.type.startsWith("video/"))
    throw new Error("Only video files are allowed.");

  const response = await videoApiClient.post<UploadResponse>(
    "/api/videos/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 300000,
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / (event.total || 1));
        console.log(`Upload Progress: ${percent}%`);
      },
    },
  );

  return response.data;
};

export const getAllVideos = async (
  token: string,
  options?: {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "title";
    sortOrder?: "asc" | "desc";
    search?: string;
    isProcessed?: boolean;
  },
): Promise<VideoListResponse> => {
  const params = new URLSearchParams();
  Object.entries(options || {}).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, String(value));
  });

  const response = await videoApiClient.get<VideoListResponse>(
    `/api/videos?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};

export const getVideoById = async (
  videoId: string,
  token: string,
): Promise<VideoData> => {
  const response = await videoApiClient.get<VideoData>(
    `/api/videos/${videoId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const updateVideo = async (
  videoId: string,
  updateData: Partial<VideoData>,
  token: string,
): Promise<VideoData> => {
  const response = await videoApiClient.put<VideoData>(
    `/api/videos/${videoId}`,
    updateData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const deleteVideo = async (
  videoId: string,
  token: string,
): Promise<DeleteResponse> => {
  const response = await videoApiClient.delete<DeleteResponse>(
    `/api/videos/${videoId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const requestVideoAnalysis = async (
  videoId: string,
  token: string,
): Promise<{
  success: boolean;
  message: string;
  analysisId?: string;
}> => {
  const response = await videoApiClient.post(
    `/api/videos/${videoId}/analyze`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const getVideoAnalysisStatus = async (
  videoId: string,
  token: string,
): Promise<any> => {
  const response = await videoApiClient.get(
    `/api/videos/${videoId}/analysis`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const getUploadProgress = async (
  uploadId: string,
): Promise<any> => {
  const response = await videoApiClient.get(
    `/api/videos/upload/${uploadId}/progress`,
  );
  return response.data;
};

// Export raw client
export { videoApiClient };

