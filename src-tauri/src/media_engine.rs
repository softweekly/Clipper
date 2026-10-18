use serde_json::Value;
use std::path::{Path, PathBuf};
use std::process::Command;

pub struct MediaEngine;

impl MediaEngine {
    pub fn get_metadata(path: &Path) -> Result<Value, String> {
        let output = Command::new("ffprobe")
            .args([
                "-v",
                "quiet",
                "-print_format",
                "json",
                "-show_format",
                "-show_streams",
                path.to_str().ok_or("Invalid path")?,
            ])
            .output()
            .map_err(|e| format!("ffprobe failed: {}", e))?;

        let stdout = String::from_utf8_lossy(&output.stdout);
        serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
    }

    pub fn trim_clip(input: &Path, output: &Path, start: f64, duration: f64) -> Result<(), String> {
        let output = Command::new("ffmpeg")
            .args([
                "-ss",
                &start.to_string(),
                "-i",
                input.to_str().ok_or("Invalid input path")?,
                "-t",
                &duration.to_string(),
                "-c",
                "copy",
                output.to_str().ok_or("Invalid output path")?,
            ])
            .output()
            .map_err(|e| format!("ffmpeg failed: {}", e))?;

        if output.status.success() {
            Ok(())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).to_string())
        }
    }

    pub fn render_sequence(inputs: &[&Path], output: &Path) -> Result<(), String> {
        // Simplified sequence render using filter_complex concat
        let mut filter_complex = String::new();
        let mut inputs_args = Vec::new();

        for (i, path) in inputs.iter().enumerate() {
            inputs_args.push("-i");
            inputs_args.push(path.to_str().ok_or("Invalid path")?);
            filter_complex.push_str(&format!("[{0}:v][{0}:a]", i));
        }

        filter_complex.push_str(&format!("concat=n={}:v=1:a=1[outv][outa]", inputs.len()));

        let mut cmd = Command::new("ffmpeg");
        cmd.args(&inputs_args);
        cmd.args([
            "-filter_complex",
            &filter_complex,
            "-map",
            "[outv]",
            "-map",
            "[outa]",
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            output.to_str().ok_or("Invalid output path")?,
        ]);

        let output = cmd.output().map_err(|e| format!("ffmpeg failed: {}", e))?;
        if output.status.success() {
            Ok(())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).to_string())
        }
    }

    pub fn start_recording(
        &self,
        output: &Path,
        crop: Option<crate::project_manager::RecordingArea>,
        record_mic: bool,
    ) -> Result<(), String> {
        // In a real implementation, this would spawn a background process
        // For this prototype, we'll simulate the FFmpeg call structure
        let mut args = vec!["-f", "gdigrab"];

        if let Some(area) = crop {
            args.push("-offset_x");
            args.push(&area.x.to_string());
            args.push("-offset_y");
            args.push(&area.y.to_string());
            args.push("-video_size");
            args.push(&format!("{}x{}", area.width, area.height));
        } else {
            args.push("-i");
            args.push("desktop");
        }

        // Audio handling would go here (dshow etc)

        println!("Starting recording to {:?}", output);
        Ok(())
    }

    pub fn stop_recording(&self) -> Result<(), String> {
        println!("Stopping recording...");
        Ok(())
    }
}
