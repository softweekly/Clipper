# Clipper Project Plan

**Objective:** Build a professional-grade non-linear video editor (NLE) mimicking the capabilities of Wondershare Filmora using open-source technologies.

## 🏗️ Architecture Blueprint

### 1. The Stack

- **Frontend**: React + TypeScript + Tailwind CSS (Tauri framework).
- **Backend**: Rust (Tauri Core).
- **Media Engine**: FFmpeg (via `ffmpeg-next` or CLI wrapper).
- **AI Intelligence**:
  - **Speech-to-Text**: OpenAI Whisper (via `faster-whisper`).
  - **Segmentation**: Mediapipe (via ONNX Runtime).
- **Rendering**: WebGPU / OpenGL for real-time preview.

### 2. Core Modules

#### A. Media Management (`MediaBin`)

- Asset indexing, proxy generation (low-res versions for editing), and metadata extraction.

#### B. The Timeline (`NLECore`)

- A state-driven model for layers, clips, transitions, and markers.
- Format: `project.json` $\rightarrow$ `Timeline` $\rightarrow$ `Track` $\rightarrow$ `Clip`.

#### C. Processing Pipeline (`RenderEngine`)

- **Input**: Decoded frames from FFmpeg.
- **Filter Graph**: A chain of operations (e.g., $\text{Crop} \rightarrow \text{ColorGrade} \rightarrow \text{Overlay}$).
- **Output**: Hardware-accelerated encoding (NVENC/AMF/QuickSync).

#### D. AI Features (`AiBridge`)

- **Auto-Captions**: Audio $\rightarrow$ Whisper $\rightarrow$ SRT $\rightarrow$ Timeline.
- **BG Removal**: Frame $\rightarrow$ Mediapipe $\rightarrow$ Mask $\rightarrow$ Shader $\rightarrow$ Composite.

## 📅 Development Milestones

### Phase 1: The Foundation (Current)

- [ ] Project scaffolding (Tauri + Rust).
- [ ] FFmpeg integration for basic playback and trimming.
- [ ] Basic Timeline UI (Drag & Drop).

### Phase 2: The Processing Engine

- [ ] Implementation of the Filter Graph (basic effects).
- [ ] Real-time preview synchronization.
- [ ] Export/Render pipeline (FFmpeg encoding).

### Phase 3: AI Integration

- [ ] Whisper bridge for automatic captions.
- [ ] Mediapipe integration for human segmentation.
- [ ] AI-driven "Smart Cut" logic.

### Phase 4: Polish & Optimization

- [ ] Hardware acceleration (GPU) for rendering.
- [ ] Proxy video system for high-res files.
- [ ] UX/UI refinements.
