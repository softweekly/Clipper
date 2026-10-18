use serde::{Deserialize, Serialize};
use std::error::Error;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TranscriptionSegment {
    pub start: f64,
    pub end: f64,
    pub text: String,
}

pub struct AiEngine;

impl AiEngine {
    pub async fn transcribe(path: &std::path::Path) -> Result<Vec<TranscriptionSegment>, Box<dyn Error>> {
        // Skeleton for Whisper integration
        println!("Transcribing file: {:?}", path);
        Ok(vec![])
    }

    pub async fn segment_human(path: &std::path::Path) -> Result<(), Box<dyn Error>> {
        // Skeleton for ONNX background removal
        println!("Segmenting human in file: {:?}", path);
        Ok(())
    }
}
