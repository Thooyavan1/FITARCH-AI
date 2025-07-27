import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useUploadVideo from "../hooks/useUploadVideo";
import {
  Upload,
  FileVideo,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

interface UploadFormData {
  title: string;
  description: string;
  file: File | null;
}

const UploadVideo: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { uploadVideo, isUploading, error } = useUploadVideo();

  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Simulate upload progress
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      return;
    }

    try {
      setUploadProgress(0);
      const videoUrl = await uploadVideo(formData.file);
      setUploadedVideoUrl(videoUrl);
      setUploadProgress(100);
      setUploadSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const isFormValid = formData.title.trim() && formData.file;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4 text-primary"
            size={48}
          />
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Upload Your Workout Video
          </h1>
          <p className="text-gray-400 text-lg">
            Share your fitness journey and get AI-powered coaching insights
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Video File
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".mp4,.mov,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                  disabled={isUploading}
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  {formData.file ? (
                    <div className="space-y-3">
                      <FileVideo className="mx-auto text-primary" size={48} />
                      <div>
                        <p className="text-white font-medium">
                          {formData.file.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto text-gray-400" size={48} />
                      <div>
                        <p className="text-white font-medium">
                          Drop your video here or click to browse
                        </p>
                        <p className="text-gray-400 text-sm">
                          Supports .mp4, .mov, .webm files
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Video Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter a descriptive title for your workout video"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isUploading}
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your workout, goals, or any specific areas you'd like AI feedback on"
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                disabled={isUploading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg"
              >
                <AlertCircle className="text-red-400" size={20} />
                <span className="text-red-400 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700 rounded-lg"
              >
                <CheckCircle className="text-green-400" size={20} />
                <div className="text-green-400 text-sm">
                  <p>Video uploaded successfully!</p>
                  {uploadedVideoUrl && (
                    <p className="text-xs text-green-300 mt-1">
                      URL: {uploadedVideoUrl}
                    </p>
                  )}
                  <p className="text-xs mt-1">Redirecting to dashboard...</p>
                </div>
              </motion.div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                isFormValid && !isUploading
                  ? "bg-primary text-white hover:bg-primary/90 shadow-lg"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </div>
              ) : (
                "Upload Now"
              )}
            </button>
          </form>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 bg-gray-900 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-primary mb-4">
            Upload Tips
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              • Ensure good lighting and clear video quality for better AI
              analysis
            </li>
            <li>• Keep your full body in frame during the workout</li>
            <li>• Record in landscape orientation for optimal viewing</li>
            <li>• Maximum file size: 100MB</li>
            <li>• Supported formats: MP4, MOV, WebM</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadVideo;
