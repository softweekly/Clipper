import type React from "react";
import { useEffect, useRef } from "react";
import { useProjectStore } from "../store/projectStore";

export const VideoPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { timeline, playheadPosition, setPlayheadPosition } = useProjectStore();

  // Determine which clip is currently under the playhead
  const getCurrentClip = () => {
    for (const track of timeline.tracks) {
      const clip = track.clips.find(
        (c) =>
          playheadPosition >= c.startTime &&
          playheadPosition <= c.startTime + c.duration,
      );
      if (clip) return clip;
    }
    return null;
  };

  const currentClip = getCurrentClip();

  useEffect(() => {
    if (!videoRef.current || !currentClip) return;

    // Calculate the relative time within the clip
    const relativeTime =
      playheadPosition - currentClip.startTime + currentClip.offset;

    // Seek to the relative time
    if (Math.abs(videoRef.current.currentTime - relativeTime) > 0.1) {
      videoRef.current.currentTime = relativeTime;
    }
  }, [playheadPosition, currentClip]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    // In a real NLE, the playhead usually follows the video during playback
    // We update the store so the timeline stays in sync
    if (currentClip) {
      const absoluteTime =
        videoRef.current.currentTime -
        currentClip.offset +
        currentClip.startTime;
      setPlayheadPosition(absoluteTime);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {currentClip ? (
        <video
          ref={videoRef}
          src={`file://${currentClip.assetId}`} // Simplified for MVP
          className="max-w-full max-h-full"
          onTimeUpdate={handleTimeUpdate}
          muted
        />
      ) : (
        <div className="text-gray-600 text-sm">
          No media at current playhead
        </div>
      )}
    </div>
  );
};
