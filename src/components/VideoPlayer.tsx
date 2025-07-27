import React from "react";

export type VideoPlayerProps = {
  src: string;
  className?: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className = "" }) => {
  return (
    <div
      className={`w-full flex justify-center items-center my-4 ${className}`}
    >
      <video
        src={src}
        controls
        autoPlay
        className="w-full max-w-2xl rounded-lg shadow-lg aspect-video bg-black"
      >
        Sorry, your browser does not support embedded videos.
      </video>
    </div>
  );
};

export default VideoPlayer;
