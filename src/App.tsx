import React, { useState } from "react";
import { MediaBin } from "./components/MediaBin";
import { Timeline } from "./components/Timeline";
import { VideoPreview } from "./components/VideoPreview";
import { AiChat } from "./components/AiChat";
import { SettingsModal } from "./components/SettingsModal";
import { api } from "./services/api";

interface RecordingPanelProps {
  isRecording: boolean;
  setIsRecording: (val: boolean) => void;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"media" | "effects" | "record">("media");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    ollamaUrl: "http://10.0.0.252:11434",
    model: "llama3",
  });

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-sm rotate-45" />
            <span className="font-bold text-lg tracking-tight">CLIPPER</span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <span className="text-sm text-gray-400 italic">
            Project: Untitled_Production_01
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-800"
          >
            ⚙️ AI Settings
          </button>
          <button 
            onClick={async () => {
              try {
                await api.renderSequence([], "export_output.mp4");
                alert("Export started successfully!");
              } catch (e) {
                alert("Export failed: " + e);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm font-medium transition shadow-lg shadow-blue-900/20"
          >
            Export Video
          </button>
        </div>
      </header>

      {/* Main Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Tabbed Navigation */}
        <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900/50">
          <div className="flex border-b border-gray-800">
            {(["media", "effects", "record"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === tab 
                    ? "text-blue-500 border-b-2 border-blue-500 bg-gray-800/50" 
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden relative">
            {activeTab === "media" && <MediaBin />}
            {activeTab === "effects" && <EffectsPanel />}
            {activeTab === "record" && (
              <RecordingPanel 
                isRecording={isRecording} 
                setIsRecording={setIsRecording} 
              />
            )}
          </div>
        </div>

        {/* Center: Preview & Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black">
          {/* Preview Window */}
          <div className="flex-1 relative flex items-center justify-center group bg-grid-pattern">
            <VideoPreview />

            {/* Playback Controls Overlay */}
            <div className="absolute bottom-6 flex items-center gap-4 bg-gray-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700 shadow-2xl">
              <button className="p-2 hover:text-blue-400 transition text-lg">⏪</button>
              <button className="p-3 bg-white text-black rounded-full text-xl hover:scale-110 transition active:scale-95">
                ▶️
              </button>
              <button className="p-2 hover:text-blue-400 transition text-lg">⏩</button>
            </div>
          </div>

          {/* Bottom: Timeline */}
          <div className="h-2/5 border-t border-gray-800 bg-gray-900/30 backdrop-blur-sm">
            <Timeline
              onClipSelect={(id) => console.log("Selected clip:", id)}
            />
          </div>
        </div>

        {/* Right: AI Director Chat */}
        <div className="w-96 border-l border-gray-800 bg-gray-900/50">
          <AiChat settings={aiSettings} />
        </div>
      </div>

      {/* Footer */}
      <footer className="h-6 bg-gray-900 border-t border-gray-800 flex items-center px-4 justify-between text-[10px] text-gray-500 uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Ready</span>
          <span>GPU: RTX 4090 (Active)</span>
          <span>Mem: 4.2GB / 32GB</span>
        </div>
        <span>v0.1.0-alpha</span>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={aiSettings}
        onSave={(s) => setAiSettings(s)}
      />
    </div>
  );
};

// Internal Component for Effects
const EffectsPanel: React.FC = () => {
  const effects = [
    { id: "blur", name: "Gaussian Blur", cat: "Correction" },
    { id: "bright", name: "Brightness/Contrast", cat: "Correction" },
    { id: "zoom", name: "Ken Burns Zoom", cat: "Animation" },
    { id: "shake", name: "Camera Shake", cat: "Animation" },
    { id: "title_1", name: "Modern Lower Third", cat: "Titles" },
    { id: "title_2", name: "Cinematic Center", cat: "Titles" },
    { id: "glitch", name: "Digital Glitch", cat: "Stylize" },
  ];

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Visual Effects</h3>
        <div className="grid grid-cols-1 gap-2">
          {effects.map(eff => (
            <button 
              key={eff.id} 
              onClick={() => alert(`Applying ${eff.name} to selected clip...`)}
              className="text-left p-2 text-sm bg-gray-800 hover:bg-blue-600/30 border border-gray-700 rounded transition group flex justify-between items-center"
            >
              <span>{eff.name}</span>
              <span className="text-[10px] text-gray-500 group-hover:text-blue-400">{eff.cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Internal Component for Recording
const RecordingPanel: React.FC<RecordingPanelProps> = ({ isRecording, setIsRecording }) => {
  const handleToggleRecording = async () => {
    if (isRecording) {
      try {
        await api.stopRecording();
        setIsRecording(false);
        alert("Recording stopped and saved!");
      } catch (e) {
        alert("Error stopping recording: " + e);
      }
    } else {
      try {
        // For now, we use a fixed path for the prototype
        await api.startRecording("recording_capture.mp4", null, true);
        setIsRecording(true);
      } catch (e) {
        alert("Error starting recording: " + e);
      }
    }
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase">Capture Settings</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Screen Capture</span>
              <span className="text-[10px] text-gray-500">Record entire desktop</span>
            </div>
            <input type="checkbox" className="w-4 h-4 accent-blue-600" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Microphone</span>
              <span className="text-[10px] text-gray-500">Input: Default Device</span>
            </div>
            <input type="checkbox" className="w-4 h-4 accent-blue-600" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
            <div className="flex flex-col">
              <span className="text-sm font-medium">System Audio</span>
              <span className="text-[10px] text-gray-500">Loopback capture</span>
            </div>
            <input type="checkbox" className="w-4 h-4 accent-blue-600" />
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Capture Area</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded">Full Screen</button>
            <button className="p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded">Custom Region</button>
          </div>
        </div>

        <button 
          onClick={handleToggleRecording}
          className={`w-full py-3 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2 ${
            isRecording 
              ? "bg-gray-700 hover:bg-gray-600 text-white" 
              : "bg-red-600 hover:bg-red-700 text-white shadow-red-900/20"
          }`}
        >
          {isRecording ? (
            <>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse" />
              STOP RECORDING
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              START RECORDING
            </>
          )}
        </button>
      </div>
    </div>
  );
};
