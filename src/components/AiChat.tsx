import type React from "react";
import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

interface AiChatProps {
  settings: {
    ollamaUrl: string;
    model: string;
  };
}

export const AiChat: React.FC<AiChatProps> = ({ settings }) => {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the new backend command via our api service
      const response = await api.chatWithAi(settings.model, input);
      setMessages((prev) => [...prev, { role: "ai" as const, text: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai" as const, text: `Error: ${error}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 w-full">
      <div className="p-4 border-b border-gray-800 font-bold text-sm uppercase text-gray-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          AI Director
        </div>
        <span className="text-[10px] text-gray-600 font-mono">{settings.model}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <div className="text-3xl opacity-20">🤖</div>
            <p className="text-xs text-gray-500">
              Ready to direct. Try: "Trim the first 5 seconds of the clip" or "Add a cinematic zoom to the scene."
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-gray-800 text-gray-300 rounded-tl-none border border-gray-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-500 p-3 rounded-xl text-xs animate-pulse border border-gray-700 rounded-tl-none">
              AI Director is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 flex gap-2 bg-gray-900/80 backdrop-blur-sm">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
          placeholder="Command the director..."
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition disabled:opacity-50 font-bold"
        >
          ➔
        </button>
      </div>
    </div>
  );
};
