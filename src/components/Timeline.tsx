import type React from "react";
import { useState } from "react";
import { useProjectStore } from "../store/projectStore";

interface TimelineProps {
  onClipSelect: (clipId: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ onClipSelect }) => {
  const {
    timeline,
    playheadPosition,
    setPlayheadPosition,
    addClipToTrack,
    mediaBin,
    moveClip,
    updateClipDuration,
  } = useProjectStore();
  const PIXELS_PER_SECOND = 50;

  const [draggingClip, setDraggingClip] = useState<{
    id: string;
    type: "move" | "trim-start" | "trim-end";
    initialX: number;
    initialStartTime: number;
    initialDuration: number;
  } | null>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / PIXELS_PER_SECOND;
    setPlayheadPosition(time);
  };

  const handleClipMouseDown = (
    e: React.MouseEvent,
    clipId: string,
    startTime: number,
    duration: number,
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const edgeThreshold = 10;
    let type: "move" | "trim-start" | "trim-end" = "move";

    if (x < edgeThreshold) type = "trim-start";
    else if (x > duration * PIXELS_PER_SECOND - edgeThreshold)
      type = "trim-end";

    setDraggingClip({
      id: clipId,
      type,
      initialX: e.clientX,
      initialStartTime: startTime,
      initialDuration: duration,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingClip) return;

    const deltaX = e.clientX - draggingClip.initialX;
    const deltaTime = deltaX / PIXELS_PER_SECOND;

    if (draggingClip.type === "move") {
      moveClip(draggingClip.id, draggingClip.initialStartTime + deltaTime);
    } else if (draggingClip.type === "trim-start") {
      const newStartTime = Math.max(
        0,
        draggingClip.initialStartTime + deltaTime,
      );
      const durationDiff = draggingClip.initialStartTime - newStartTime;
      updateClipDuration(
        draggingClip.id,
        draggingClip.initialDuration + durationDiff,
      );
      moveClip(draggingClip.id, newStartTime);
    } else if (draggingClip.type === "trim-end") {
      updateClipDuration(
        draggingClip.id,
        Math.max(0.1, draggingClip.initialDuration + deltaTime),
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingClip(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData("assetId");
    if (!assetId) return;

    const asset = mediaBin.find((a) => a.id === assetId);
    if (!asset) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const startTime = x / PIXELS_PER_SECOND;

    addClipToTrack("v1", {
      assetId: asset.id,
      startTime: Math.max(0, startTime),
      duration: asset.duration,
      offset: 0,
      layer: 0,
      effects: [],
    });
  };

  return (
    <div
      className="flex-1 bg-gray-950 text-white overflow-hidden flex flex-col border-t border-gray-800"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Time Ruler */}
      <div
        className="h-8 bg-gray-900 border-b border-gray-800 relative cursor-crosshair select-none"
        onClick={handleTimelineClick}
      >
        {Array.from({ length: Math.ceil(timeline.duration / 5) + 1 }).map(
          (_, i) => (
            <div
              key={i}
              className="absolute border-l border-gray-700 h-full text-[10px] pl-1 text-gray-500"
              style={{ left: i * 5 * PIXELS_PER_SECOND }}
            >
              {i * 5}s
            </div>
          ),
        )}
        {/* Playhead Indicator */}
        <div
          className="absolute top-0 bottom-0 w-px bg-red-500 z-10 pointer-events-none"
          style={{ left: playheadPosition * PIXELS_PER_SECOND }}
        />
      </div>

      {/* Tracks Area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto relative bg-grid-pattern">
        <div
          style={{
            width: Math.max(1200, timeline.duration * PIXELS_PER_SECOND),
          }}
        >
          {timeline.tracks.map((track) => (
            <div
              key={track.id}
              className="h-16 border-b border-gray-800 relative flex items-center"
            >
              <div className="sticky left-0 z-20 bg-gray-900 w-24 h-full flex items-center justify-center border-r border-gray-800 text-xs font-bold uppercase text-gray-400">
                {track.id}
              </div>
              <div className="relative flex-1 h-full">
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    onMouseDown={(e) =>
                      handleClipMouseDown(
                        e,
                        clip.id,
                        clip.startTime,
                        clip.duration,
                      )
                    }
                    onClick={() => onClipSelect(clip.id)}
                    className="absolute h-12 top-2 bg-blue-600 border border-blue-400 rounded-md cursor-move hover:bg-blue-500 transition-colors flex items-center px-2 overflow-hidden text-xs font-medium select-none"
                    style={{
                      left: clip.startTime * PIXELS_PER_SECOND,
                      width: clip.duration * PIXELS_PER_SECOND,
                    }}
                  >
                    {clip.assetId}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Playhead Indicator (Overlay) */}
        <div
          className="absolute top-0 bottom-0 w-px bg-red-500 z-10 pointer-events-none"
          style={{
            left: `calc(96px + ${playheadPosition * PIXELS_PER_SECOND}px)`,
          }}
        />
      </div>
    </div>
  );
};
