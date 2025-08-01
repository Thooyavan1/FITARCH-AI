import React from "react";

export type VideoPlayerProps = {
  src: string; // Video file path (e.g., /videos/intro.mp4)
  className?: string; // Optional custom styles
};

/**
 * A reusable responsive video player component.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className = "" }) => {
  return (
    <div className={`w-full flex justify-center items-center my-4 ${className}`}>
      <video
        src={src}
        controls
        autoPlay
        playsInline
        className="w-full max-w-3xl rounded-xl shadow-xl aspect-video bg-black"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
