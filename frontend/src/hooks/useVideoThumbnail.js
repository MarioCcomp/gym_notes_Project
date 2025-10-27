import { useState, useEffect } from "react";

export function useVideoThumbnail(videoSrc) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!videoSrc) return;

    const video = document.createElement("video");
    video.src = videoSrc;
    video.preload = "metadata";
    video.muted = true;

    const captureFrame = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/jpeg");
      setThumbnail(dataURL);
    };

    video.addEventListener("loadeddata", () => {
      video.currentTime = 0;
      setTimeout(captureFrame, 150); 
    });

    return () => {
      video.remove();
    };
  }, [videoSrc]);

  return thumbnail;
}
