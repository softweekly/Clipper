#!/bin/bash

# Clipper Smoke Test Suite
# This script verifies that the external dependencies required for Clipper are functional.

echo "🚀 Starting Clipper Dependency Smoke Tests..."
echo "--------------------------------------------------"

# 1. Check FFmpeg
if command -v ffmpeg >/dev/null 2>&1; then
    echo "✅ FFmpeg: INSTALLED"
    ffmpeg -version | grep "version" | head -n 1
else
    echo "❌ FFmpeg: MISSING (Please install FFmpeg and add to PATH)"
    exit 1
fi

# 2. Check ffprobe
if command -v ffprobe >/dev/null 2>&1; then
    echo "✅ ffprobe: INSTALLED"
else
    echo "❌ ffprobe: MISSING"
    exit 1
fi

# 3. Check Ollama connectivity
echo "Checking Ollama connectivity..."
curl -s http://localhost:11434/api/tags >/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Ollama: CONNECTED (Localhost)"
else
    echo "⚠️ Ollama: NOT DETECTED on localhost (Check if you are using a remote server)"
fi

# 4. Check Rust/Tauri Environment
if command -v cargo >/dev/null 2>&1; then
    echo "✅ Cargo/Rust: INSTALLED"
else
    echo "❌ Cargo/Rust: MISSING"
    exit 1
fi

echo "--------------------------------------------------"
echo "🎉 All critical dependencies are verified. Clipper is ready to run!"
