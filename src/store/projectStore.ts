import { create } from "zustand";
import type { ProjectState, Clip, MediaAsset } from "../types/project";

interface ProjectStore extends ProjectState {
  // Actions
  setProjectName: (name: string) => void;
  addAsset: (asset: MediaAsset) => void;
  addClipToTrack: (trackId: string, clip: Omit<Clip, "id">) => void;
  moveClip: (clipId: string, newStartTime: number) => void;
  updateClipDuration: (clipId: string, newDuration: number) => void;
  removeClip: (clipId: string) => void;
  setPlayheadPosition: (time: number) => void;
  playheadPosition: number;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  id: "project-1",
  name: "Untitled Project",
  resolution: { width: 1920, height: 1080, fps: 30 },
  timeline: {
    tracks: [
      { id: "v1", type: "video", clips: [] },
      { id: "v2", type: "video", clips: [] },
      { id: "a1", type: "audio", clips: [] },
    ],
    duration: 0,
  },
  mediaBin: [],
  playheadPosition: 0,

  setProjectName: (name) => set({ name }),

  addAsset: (asset) =>
    set((state) => ({
      mediaBin: [...state.mediaBin, asset],
    })),

  addClipToTrack: (trackId, clipData) =>
    set((state) => {
      const newClip: Clip = {
        ...clipData,
        id: Math.random().toString(36).substr(2, 9),
      };

      const newTracks = state.timeline.tracks.map((track) => {
        if (track.id === trackId) {
          return { ...track, clips: [...track.clips, newClip] };
        }
        return track;
      });

      // Update total timeline duration
      const allClips = newTracks.flatMap((t) => t.clips);
      const maxEnd = Math.max(
        0,
        ...allClips.map((c) => c.startTime + c.duration),
      );

      return {
        timeline: { ...state.timeline, tracks: newTracks, duration: maxEnd },
      };
    }),

  moveClip: (clipId, newStartTime) =>
    set((state) => {
      const newTracks = state.timeline.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId
            ? { ...clip, startTime: Math.max(0, newStartTime) }
            : clip,
        ),
      }));
      return { timeline: { ...state.timeline, tracks: newTracks } };
    }),

  updateClipDuration: (clipId, newDuration) =>
    set((state) => {
      const newTracks = state.timeline.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId
            ? { ...clip, duration: Math.max(0.1, newDuration) }
            : clip,
        ),
      }));
      return { timeline: { ...state.timeline, tracks: newTracks } };
    }),

  removeClip: (clipId) =>
    set((state) => {
      const newTracks = state.timeline.tracks.map((track) => ({
        ...track,
        clips: track.clips.filter((c) => c.id !== clipId),
      }));
      return { timeline: { ...state.timeline, tracks: newTracks } };
    }),

  setPlayheadPosition: (time) => set({ playheadPosition: time }),
}));
