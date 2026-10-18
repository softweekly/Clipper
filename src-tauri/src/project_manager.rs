use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Asset {
    pub id: String,
    pub path: String,
    pub name: String,
    pub duration: f64,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Clip {
    pub id: String,
    pub asset_id: String,
    pub start_time: f64, // Start time on the timeline
    pub trim_start: f64, // Start point within the asset
    pub duration: f64,
    pub layer: u32,
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
    pub effects: Vec<Effect>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Effect {
    pub effect_id: String,
    pub params: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RecordingArea {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

pub struct ProjectState {
    pub assets: HashMap<String, Asset>,
    pub clips: HashMap<String, Clip>,
    pub current_time: f64,
}

impl ProjectState {
    pub fn new() -> Self {
        Self {
            assets: HashMap::new(),
            clips: HashMap::new(),
            current_time: 0.0,
        }
    }
}

pub struct ProjectManager {
    pub state: Arc<Mutex<ProjectState>>,
}

impl ProjectManager {
    pub fn new() -> Self {
        Self {
            state: Arc::new(Mutex::new(ProjectState::new())),
        }
    }
}
