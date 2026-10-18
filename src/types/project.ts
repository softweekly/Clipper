export interface ProjectState {
  id: string;
  name: string;
  resolution: {
    width: number;
    height: number;
    fps: number;
  };
  timeline: Timeline;
  mediaBin: MediaAsset[];
  captions: Caption[];
}

export interface Timeline {
  tracks: Track[];
  duration: number; // Total duration in seconds
}

export interface Track {
  id: string;
  type: "video" | "audio" | "caption";
  clips: Clip[];
}

export interface Clip {
  id: string;
  assetId: string;
  startTime: number; // Position on timeline (seconds)
  duration: number; // Duration on timeline (seconds)
  offset: number; // Start point within the source asset (seconds)
  layer: number;
  effects: Effect[];
}

export interface Effect {
  id: string;
  type: "color" | "transform" | "ai_segmentation" | "audio_filter";
  params: Record<string, unknown>;
}

export interface MediaAsset {
  id: string;
  path: string;
  name: string;
  duration: number;
  type: "video" | "audio" | "image";
  resolution?: { width: number; height: number };
  transcript?: TranscriptionSegment[];
}

export interface Caption {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  style: Record<string, unknown>;
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}
