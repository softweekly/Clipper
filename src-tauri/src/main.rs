// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod media_engine;
mod ai_engine;
mod project_manager;
mod mcp_commands;
mod ollama_client;

use media_engine::MediaEngine;
use project_manager::{ProjectManager, RecordingArea};
use ollama_client::OllamaClient;
use std::path::Path;
use tauri::{command, State, Manager};
use serde_json::Value;

#[command]
async fn get_media_metadata(path: String) -> Result<Value, String> {
    MediaEngine::get_metadata(Path::new(&path))
        .map_err(|e| e.to_string())
}

#[command]
async fn trim_media(input_path: String, output_path: String, start: f64, duration: f64) -> Result<(), String> {
    MediaEngine::trim_clip(
        Path::new(&input_path),
        Path::new(&output_path),
        start,
        duration,
    )
    .map_err(|e| e.to_string())
}

#[command]
async fn render_sequence(input_paths: Vec<String>, output_path: String) -> Result<(), String> {
    let paths: Vec<&Path> = input_paths.iter().map(|s| Path::new(s)).collect();
    MediaEngine::render_sequence(&paths, Path::new(&output_path))
        .map_err(|e| e.to_string())
}

#[command]
async fn start_recording(
    state: State<'_, MediaEngine>, 
    output_path: String, 
    crop: Option<RecordingArea>, 
    record_mic: bool
) -> Result<(), String> {
    state.start_recording(Path::new(&output_path), crop, record_mic)
        .map_err(|e| e.to_string())
}

#[command]
async fn stop_recording(state: State<'_, MediaEngine>) -> Result<(), String> {
    state.stop_recording()
        .map_err(|e| e.to_string())
}

#[command]
async fn chat_with_ai(
    state: State<'_, OllamaClient>,
    model: String,
    prompt: String,
) -> Result<String, String> {
    state.chat(&model, &prompt)
        .await
        .map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .manage(MediaEngine)
        .manage(ProjectManager::new())
        .manage(OllamaClient::new("http://10.0.0.252:11434".to_string()))
        .invoke_handler(tauri::generate_handler![
            get_media_metadata,
            trim_media,
            render_sequence,
            start_recording,
            stop_recording,
            chat_with_ai
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
