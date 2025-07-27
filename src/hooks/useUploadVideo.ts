import { useState } from "react";

const SUPPORTED_FORMATS = ["video/mp4", "video/quicktime", "video/webm"];
const DUMMY_VIDEO_URL = "https://dummyvideo.com/video123.mp4";

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = async (file: File): Promise<string> => {
    setError(null);
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError(
        "Unsupported video format. Please upload .mp4, .mov, or .webm files.",
      );
      throw new Error("Unsupported video format");
    }
    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsUploading(false);
      return DUMMY_VIDEO_URL;
    } catch (e) {
      setError("Failed to upload video. Please try again.");
      setIsUploading(false);
      throw e;
    }
  };

  return {
    uploadVideo,
    isUploading,
    error,
  };
};

export default useUploadVideo;
