import { invoke } from "@tauri-apps/api/core";

export const api = {
  // AI Director API
  async chatWithAi(model: string, prompt: string): Promise<string> {
    return await invoke("chat_with_ai", { model, prompt });
  },

  // Media Operations
  async getMetadata(path: string): Promise<any> {
    return await invoke("get_media_metadata", { path });
  },

  async fetchMediaMetadata(path: string): Promise<any> {
    return await this.getMetadata(path);
  },

  async trimMedia(inputPath: string, outputPath: string, start: number, duration: number): Promise<void> {
    return await invoke("trim_media", { inputPath, outputPath, start, duration });
  },

  async renderSequence(inputPaths: string[], outputPath: string): Promise<void> {
    return await invoke("render_sequence", { inputPaths, outputPath });
  },

  // Recording API
  async startRecording(outputPath: string, crop: any, recordMic: boolean): Promise<void> {
    return await invoke("start_recording", { outputPath, crop, recordMic });
  },

  async stopRecording(): Promise<void> {
    return await invoke("stop_recording");
  },
};
