# Clipper - Project Summary

## 🌟 Overview

**Clipper** is a high-performance, open-source Non-Linear Editor (NLE) designed to provide a professional video editing experience. It combines a modern, responsive frontend with a powerful Rust-based media engine, integrating AI-driven automation via the Model Context Protocol (MCP).

## 🛠️ Technical Architecture

### 1. The Frontend (UI/UX)

- **Framework**: React + TypeScript + Tailwind CSS.
- **Host**: Tauri (for native OS integration and performance).
- **State Management**: Zustand (centralized store for project state, timeline, and playhead).
- **Interface**:
  - **Media Bin**: Asset management with automated metadata extraction.
  - **Timeline**: Multi-track, interactive workspace supporting spatial drag-and-drop and precision trimming.
  - **Preview Player**: Frame-accurate synchronization between the timeline and video playback.

### 2. The Backend (Engine)

- **Core**: Rust.
- **Media Processing**: FFmpeg (via CLI/Wrapper) for decoding, encoding, and trimming.
- **AI Suite**:
  - **Speech-to-Text**: OpenAI Whisper integration for automatic captioning.
  - **Vision**: Mediapipe/ONNX integration for human subject segmentation (background removal).
- **Project Management**: Thread-safe server-side state management for project persistence.

### 3. The AI Director (MCP Server)

OpenFilmora implements the **Model Context Protocol (MCP)**, transforming the editor into a tool that can be driven by an LLM.

- **Agentic Tools**: Exposed commands for `add_asset`, `add_clip`, `generate_captions`, and `export_video`.
- **Workflow**: Enables a "Prompt-to-Video" pipeline where an AI agent can assemble a full project and render the final output autonomously.

## 🚀 Key Features Implemented

- [x] **Professional Media Bin**: Automatic resolution and duration detection.
- [x] **Interactive Timeline**: Drag-and-drop clips, trim start/end, and slide repositioning.
- [x] **Sync-Preview**: Bi-directional synchronization between playhead and video frames.
- [x] **AI Captions**: Automated transcription and timeline alignment.
- [x] **AI Background Removal**: Mask-based human segmentation.
- [x] **Hardware Export**: High-speed rendering via FFmpeg.

## 📦 Tech Stack Summary

- **Languages**: TypeScript, Rust.
- **Tooling**: Tauri, FFmpeg, ONNX Runtime, Zustand, React.
- **Protocol**: MCP (Model Context Protocol).
