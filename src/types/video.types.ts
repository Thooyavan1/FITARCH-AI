export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  createdAt: Date;
  tags?: string[];
  duration?: number;
  language?: string;
}

export interface UploadVideoInput {
  title: string;
  description?: string;
  file: File;
  tags?: string[];
  language?: string;
}
