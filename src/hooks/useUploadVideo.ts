import { useState } from "react";

// Supported video formats
const SUPPORTED_FORMATS = ["video/mp4", "video/quicktime", "video/webm"];

// Replace this with actual uploaded video URL when backend is ready
const DUMMY_VIDEO_URL = "https://dummyvideo.com/video123.mp4";

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = async (file: File): Promise<string> => {
    setError(null);

    // Validate file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      const formatError =
        "Unsupported video format. Please upload .mp4, .mov, or .webm files.";
      setError(formatError);
      throw new Error(formatError);
    }

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated uploaded video URL (replace with backend integration)
      const uploadedUrl = DUMMY_VIDEO_URL;

      setIsUploading(false);
      return uploadedUrl;
    } catch (e) {
      const uploadError = "Failed to upload video. Please try again.";
      setError(uploadError);
      setIsUploading(false);
      throw new Error(uploadError);
    }
  };

  return {
    uploadVideo,
    isUploading,
    error,
  };
};

export default useUploadVideo;
