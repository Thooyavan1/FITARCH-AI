// Represents a video object stored in the system
export interface Video {
  id: string; // Unique video ID
  title: string; // Title of the video
  description?: string; // Optional description
  url: string; // URL to the video file
  thumbnailUrl?: string; // Optional thumbnail image URL
  uploadedBy: string; // User ID or name who uploaded
  createdAt: Date; // Upload timestamp
  tags?: string[]; // Optional tags for search/filter
  duration?: number; // Duration in seconds (optional)
  language?: string; // Language code (e.g., 'en', 'ta') (optional)
}

// Represents the data needed to upload a video
export interface UploadVideoInput {
  title: string; // Video title
  description?: string; // Optional description
  file: File; // Actual video file input (browser File object)
  tags?: string[]; // Optional tags
  language?: string; // Language of the video (optional)
}
