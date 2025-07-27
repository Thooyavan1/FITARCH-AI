import axios from "axios";
import type { AxiosResponse } from "axios";

// Base URL for video API - uses environment variable or fallback
const VIDEO_API_BASE_URL =
  import.meta.env.VITE_VIDEO_API_URL || "https://your-api.com";

// Video data interfaces
interface VideoData {
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

// Create axios instance with default configuration
const videoApiClient = axios.create({
  baseURL: VIDEO_API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for video operations
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
videoApiClient.interceptors.request.use(
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
videoApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Video API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

/**
 * Uploads a video file to the server
 * @param formData - FormData containing the video file and metadata
 * @param token - Authentication token
 * @returns Promise<any> - Upload response with video data
 */
export const uploadVideo = async (
  formData: FormData,
  token: string,
): Promise<any> => {
  try {
    if (!formData) {
      throw new Error("No video data provided for upload.");
    }

    if (!token) {
      throw new Error("Authentication token is required for video upload.");
    }

    // Validate file size (e.g., max 100MB)
    const file = formData.get("video") as File;
    if (file && file.size > 100 * 1024 * 1024) {
      throw new Error("Video file size must be less than 100MB.");
    }

    // Validate file type
    if (file && !file.type.startsWith("video/")) {
      throw new Error("Please select a valid video file.");
    }

    const response: AxiosResponse<UploadResponse> = await videoApiClient.post(
      "/api/videos/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 300000, // 5 minutes timeout for upload
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          console.log(`Upload progress: ${percentCompleted}%`);

          // You can emit this progress to a callback or state management
          // onProgress?.(percentCompleted);
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid video file or metadata provided.");
      } else if (status === 401) {
        throw new Error(
          "Authentication required. Please log in to upload videos.",
        );
      } else if (status === 413) {
        throw new Error("Video file is too large. Please use a smaller file.");
      } else if (status === 415) {
        throw new Error(
          "Unsupported video format. Please use MP4, AVI, or MOV.",
        );
      } else if (status === 429) {
        throw new Error("Upload limit exceeded. Please try again later.");
      } else if (status && status >= 500) {
        throw new Error(
          "Video upload service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Upload failed: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error during upload. Please check your connection and try again.",
    );
  }
};

/**
 * Fetches all videos for the authenticated user
 * @param token - Authentication token
 * @param options - Optional query parameters
 * @returns Promise<any> - List of videos with pagination
 */
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
): Promise<any> => {
  try {
    if (!token) {
      throw new Error("Authentication token is required to fetch videos.");
    }

    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.sortBy) params.append("sortBy", options.sortBy);
    if (options?.sortOrder) params.append("sortOrder", options.sortOrder);
    if (options?.search) params.append("search", options.search);
    if (options?.isProcessed !== undefined)
      params.append("isProcessed", options.isProcessed.toString());

    const response: AxiosResponse<VideoListResponse> = await videoApiClient.get(
      `/api/videos?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error(
          "Authentication required. Please log in to view videos.",
        );
      } else if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to view these videos.",
        );
      } else if (status === 404) {
        throw new Error("No videos found.");
      } else if (status && status >= 500) {
        throw new Error(
          "Video service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Failed to fetch videos: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error while fetching videos. Please check your connection and try again.",
    );
  }
};

/**
 * Deletes a video by ID
 * @param videoId - ID of the video to delete
 * @param token - Authentication token
 * @returns Promise<any> - Deletion response
 */
export const deleteVideo = async (
  videoId: string,
  token: string,
): Promise<any> => {
  try {
    if (!videoId) {
      throw new Error("Video ID is required for deletion.");
    }

    if (!token) {
      throw new Error("Authentication token is required to delete videos.");
    }

    const response: AxiosResponse<DeleteResponse> = await videoApiClient.delete(
      `/api/videos/${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid video ID provided.");
      } else if (status === 401) {
        throw new Error(
          "Authentication required. Please log in to delete videos.",
        );
      } else if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to delete this video.",
        );
      } else if (status === 404) {
        throw new Error("Video not found or already deleted.");
      } else if (status && status >= 500) {
        throw new Error(
          "Video deletion service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Failed to delete video: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error while deleting video. Please check your connection and try again.",
    );
  }
};

/**
 * Gets a single video by ID
 * @param videoId - ID of the video to fetch
 * @param token - Authentication token
 * @returns Promise<any> - Video data
 */
export const getVideoById = async (
  videoId: string,
  token: string,
): Promise<any> => {
  try {
    if (!videoId) {
      throw new Error("Video ID is required.");
    }

    if (!token) {
      throw new Error("Authentication token is required to fetch video.");
    }

    const response: AxiosResponse<VideoData> = await videoApiClient.get(
      `/api/videos/${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid video ID provided.");
      } else if (status === 401) {
        throw new Error(
          "Authentication required. Please log in to view this video.",
        );
      } else if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to view this video.",
        );
      } else if (status === 404) {
        throw new Error("Video not found.");
      } else if (status && status >= 500) {
        throw new Error(
          "Video service is temporarily unavailable. Please try again later.",
        );
      } else {
        throw new Error(
          `Failed to fetch video: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error(
      "Network error while fetching video. Please check your connection and try again.",
    );
  }
};

/**
 * Updates video metadata
 * @param videoId - ID of the video to update
 * @param updateData - Data to update
 * @param token - Authentication token
 * @returns Promise<any> - Updated video data
 */
export const updateVideo = async (
  videoId: string,
  updateData: Partial<VideoData>,
  token: string,
): Promise<any> => {
  try {
    if (!videoId) {
      throw new Error("Video ID is required for update.");
    }

    if (!token) {
      throw new Error("Authentication token is required to update videos.");
    }

    const response: AxiosResponse<VideoData> = await videoApiClient.put(
      `/api/videos/${videoId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid update data provided.");
      } else if (status === 401) {
        throw new Error(
          "Authentication required. Please log in to update videos.",
        );
      } else if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to update this video.",
        );
      } else if (status === 404) {
        throw new Error("Video not found.");
      } else if (status === 422) {
        throw new Error("Validation failed. Please check your input.");
      } else if (status && status >= 500) {
        throw new Error("Video update service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to update video: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while updating video.");
  }
};

/**
 * Requests AI analysis for a video
 * @param videoId - ID of the video to analyze
 * @param token - Authentication token
 * @returns Promise<any> - Analysis request response
 */
export const requestVideoAnalysis = async (
  videoId: string,
  token: string,
): Promise<any> => {
  try {
    if (!videoId) {
      throw new Error("Video ID is required for analysis.");
    }

    if (!token) {
      throw new Error("Authentication token is required to request analysis.");
    }

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      analysisId?: string;
    }> = await videoApiClient.post(
      `/api/videos/${videoId}/analyze`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Video is not ready for analysis.");
      } else if (status === 401) {
        throw new Error(
          "Authentication required. Please log in to request analysis.",
        );
      } else if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to analyze this video.",
        );
      } else if (status === 404) {
        throw new Error("Video not found.");
      } else if (status === 409) {
        throw new Error("Analysis already in progress for this video.");
      } else if (status && status >= 500) {
        throw new Error("Analysis service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to request analysis: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while requesting analysis.");
  }
};

/**
 * Gets analysis status for a video
 * @param videoId - ID of the video
 * @param token - Authentication token
 * @returns Promise<any> - Analysis status and results
 */
export const getVideoAnalysisStatus = async (
  videoId: string,
  token: string,
): Promise<any> => {
  try {
    if (!videoId) {
      throw new Error("Video ID is required.");
    }

    if (!token) {
      throw new Error(
        "Authentication token is required to check analysis status.",
      );
    }

    const response: AxiosResponse<any> = await videoApiClient.get(
      `/api/videos/${videoId}/analysis`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error(
          "Authentication required. Please log in to check analysis status.",
        );
      } else if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to view this analysis.",
        );
      } else if (status === 404) {
        throw new Error("Video or analysis not found.");
      } else if (status && status >= 500) {
        throw new Error("Analysis service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to get analysis status: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while checking analysis status.");
  }
};

/**
 * Gets video upload progress (for real-time updates)
 * @param uploadId - Upload session ID
 * @returns Promise<any> - Upload progress data
 */
export const getUploadProgress = async (uploadId: string): Promise<any> => {
  try {
    if (!uploadId) {
      throw new Error("Upload ID is required.");
    }

    const response: AxiosResponse<any> = await videoApiClient.get(
      `/api/videos/upload/${uploadId}/progress`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        throw new Error("Upload session not found.");
      } else if (status && status >= 500) {
        throw new Error("Upload progress service is temporarily unavailable.");
      } else {
        throw new Error(
          `Failed to get upload progress: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw new Error("Network error while checking upload progress.");
  }
};

// Export the axios instance for custom requests if needed
export { videoApiClient };
