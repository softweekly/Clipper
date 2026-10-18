# Clipper User & Developer Instructions

Welcome to **Clipper**. This document provides everything you need to get the project running, use the editor, and integrate it with AI agents.

## ⚙️ Installation & Setup

### 1. Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v20+ recommended)
- **Rust** (latest stable)
- **FFmpeg** (Must be installed and added to your system `PATH`)
- **Tauri CLI**: `npm install -g @tauri-apps/cli`

### 2. Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd Clipper

# Install frontend dependencies
npm install

# Run the application in development mode
npm run tauri dev
```

---

## 🎬 Using the Editor

### Importing Media

1. Click the **"Import Media"** button in the Media Bin.
2. Select your video, audio, or image files.
3. The app will automatically extract the duration and resolution using `ffprobe`.

### Editing the Timeline

- **Adding Clips**: Drag an asset from the **Media Bin** and drop it onto a track (V1, V2, A1).
- **Moving Clips**: Click and hold the center of a clip to slide it to a new timestamp.
- **Trimming**: Grab the **left or right edge** of a clip to adjust its start/end points.
- **Navigation**: Click anywhere on the **Time Ruler** to jump the playhead to that position.

### Previewing and Exporting

- Use the **Preview Player** to see your edits in real-time.
- Once satisfied, click **Export** to render the final sequence into a high-quality MP4 file.

---

## 🤖 AI Setup & Integration

OpenFilmora features an **AI Director** that can automate your editing process. This is powered by **Ollama**, allowing you to run your AI locally for privacy and speed.

### 1. Install Ollama

1. Download and install Ollama from [ollama.com](https://ollama.com).
2. Open your terminal and pull a capable model (Llama-3 or DeepSeek are recommended for tool use):

   ```bash
   ollama pull llama3
   ```

### 2. Server Configuration (For Remote Servers)

If you are running Ollama on a separate server (not the same machine as the app), you must ensure Ollama is listening on all network interfaces.

- **On Linux/macOS**: Set the environment variable `OLLAMA_HOST=0.0.0.0` before starting Ollama.
- **On Windows**: Set `OLLAMA_HOST` in your system environment variables to `0.0.0.0`.

### 3. Connecting the App to your AI

By default, the app looks for Ollama at `http://localhost:11434`. To change this to a local server IP:

1. Open `src-tauri/src/ollama_client.rs`.
2. Update the `base_url` variable to your server's IP (e.g., `http://10.0.0.252:11434/api/chat`).
3. Rebuild the app using `npm run tauri build`.

### 4. Using the AI Director

Once the app is running:

1. Open the **AI Director** panel on the right side of the editor.
2. Type your request in natural language.
3. **Examples**:
   - *"Import the video at 'C:/assets/intro.mp4' and place it at the start of the timeline."*
   - *"Find the best cuts for a 15-second hype reel and align them to the beat."*
   - *"Generate captions for the current clip and make them yellow."*

### 5. How the AI "Thinks"

The AI Director uses the **Model Context Protocol (MCP)**. It analyzes your current project state (what clips are where) and returns specific tool calls (like `mcp_add_clip`) to modify your project in real-time.

---

## 🛠️ Developer Notes

- **State Management**: All project data is held in `src/store/projectStore.ts`.
- **Media Logic**: All FFmpeg and AI logic is located in `src-tauri/src/media_engine.rs` and `src-tauri/src/ai_engine.rs`.
- **Customization**: To add new AI models, update the `AiEngine` Rust module and register the corresponding MCP command in `main.rs`.
