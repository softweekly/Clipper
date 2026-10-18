# Clipper Testing & Verification Guide

This document outlines the testing strategy and verification procedures for **Clipper**. Because Clipper is a hybrid application involving a React frontend, a Rust backend, and external binaries (FFmpeg, Ollama), it requires a multi-layered testing approach.

## 🧪 Testing Layers

### 1. Environment Smoke Tests

**Goal:** Verify that the external dependencies required for the app to function are installed and accessible.

- **Tool**: `Clipper/scripts/smoke_test.sh`
- **What it checks**:
  - **FFmpeg**: Presence of `ffmpeg` and `ffprobe` in the system PATH.
  - **Ollama**: Connectivity to the Ollama API (`/api/tags`).
  - **Rust**: Availability of the `cargo` build tool.
- **How to run**:

  ```bash
  chmod +x Clipper/scripts/smoke_test.sh
  ./Clipper/scripts/smoke_test.sh
  ```

### 2. Core Logic Unit Tests

**Goal:** Ensure the mathematical and structural integrity of the project state.

- **Tool**: Rust's built-in test runner (`cargo test`).
- **What it checks**:
  - **Timeline Math**: Verifies that adding/moving clips updates the project duration correctly.
  - **Boundary Checks**: Ensures clips cannot have negative start times or zero duration.
  - **State Persistence**: Confirms that assets are correctly registered in the `ProjectManager`.
- **How to run**:

  ```bash
  cd Clipper/src-tauri
  cargo test
  ```

### 3. AI Integration & MCP Tests

**Goal:** Verify that the AI Director can successfully communicate with the media engine.

- **Mechanism**: Contract testing within `mcp_commands.rs`.
- **What it checks**:
  - **JSON Parsing**: Ensures the AI's tool calls are correctly deserialized.
  - **Error Recovery**: Verifies that the system handles "missing asset" or "invalid path" errors gracefully without crashing.
  - **Semantic Accuracy**: Confirms that `mcp_semantic_cut` correctly identifies keywords in transcripts.

### 4. End-to-End (E2E) Manual Verification

**Goal:** Validate the complete user journey from import to export.

**The "Golden Path" Test Suite:**

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| **1** | Import a video file | Duration and resolution appear in Media Bin |
| **2** | Drag clip to Timeline | Clip appears as a block at the correct X position |
| **3** | Trim clip edge | Clip width changes; project duration updates |
| **4** | Move playhead | `VideoPreview` seeks to the correct frame |
| **5** | Prompt AI Director | AI executes a tool (e.g., `add_clip`) and project updates |
| **6** | Click Export | A final `.mp4` is generated via FFmpeg |

## 🛠️ Troubleshooting Common Failures

| Failure | Cause | Fix |
| :--- | :--- | :--- |
| `ffprobe failed` | FFmpeg not in PATH | Install FFmpeg and add `/bin` to system environment variables. |
| `Ollama API error` | Server not running | Run `ollama serve` or check `OLLAMA_HOST` configuration. |
| `Tauri panic` | Port conflict | Ensure no other process is using the Tauri dev port. |
| `Clip not found` | State mismatch | Restart the app to reset the `ProjectManager` state. |
