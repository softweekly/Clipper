import type React from "react";
import { useState } from "react";
import { ProjectState, type MediaAsset } from "../types/project";
import { fetchMediaMetadata } from "../services/api";

export const MediaBin: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newAssets: MediaAsset[] = [];
    for (const file of Array.from(files)) {
      // In a real Tauri app, we'd use the dialog plugin to get absolute paths
      const path = file.name;
      try {
        const metadata = await fetchMediaMetadata(path);
        newAssets.push({
          id: Math.random().toString(36).substr(2, 9),
          path,
          name: file.name,
          duration: metadata.format?.duration || 0,
          type: "video",
          resolution: {
            width: metadata.streams?.[0]?.width || 0,
            height: metadata.streams?.[0]?.height || 0,
          },
        });
      } catch (e) {
        console.error(`Failed to load ${file.name}`, e);
      }
    }
    setAssets([...assets, ...newAssets]);
  };

  const handleDragStart = (e: React.DragEvent, assetId: string) => {
    e.dataTransfer.setData("assetId", assetId);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Media Bin</h2>
        <label className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded cursor-pointer text-sm transition">
          Import Media
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileImport}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, asset.id)}
            className="bg-gray-800 p-2 rounded border border-gray-700 hover:border-blue-500 transition cursor-grab active:cursor-grabbing"
          >
            <div className="aspect-video bg-black mb-2 rounded flex items-center justify-center text-xs text-gray-500">
              {asset.type === "video" ? "🎥 Video" : "🎵 Audio"}
            </div>
            <div className="text-sm truncate font-medium">{asset.name}</div>
            <div className="text-xs text-gray-400">
              {asset.duration.toFixed(2)}s | {asset.resolution?.width}x
              {asset.resolution?.height}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
