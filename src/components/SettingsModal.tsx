import React, { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    ollamaUrl: string;
    model: string;
  };
  onSave: (settings: { ollamaUrl: string; model: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [url, setUrl] = useState(settings.ollamaUrl);
  const [model, setModel] = useState(settings.model);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl w-96 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">AI Director Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Ollama Server URL</label>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">LLM Model</label>
            <input 
              type="text" 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">Cancel</button>
          <button 
            onClick={() => onSave({ ollamaUrl: url, model: model })}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded font-medium transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
