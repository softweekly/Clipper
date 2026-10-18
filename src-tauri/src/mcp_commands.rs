use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct McpToolResponse {
    pub content: String,
    pub is_error: bool,
}

pub fn mcp_add_asset(asset_path: String) -> McpToolResponse {
    // Logic to add asset to ProjectManager
    McpToolResponse {
        content: format!("Asset added from path: {}", asset_path),
        is_error: false,
    }
}

pub fn mcp_add_clip(asset_id: String, start: f64, duration: f64) -> McpToolResponse {
    // Logic to add clip to timeline
    McpToolResponse {
        content: format!(
            "Clip added for asset {} starting at {} for {}s",
            asset_id, start, duration
        ),
        is_error: false,
    }
}

pub fn mcp_export_video(output_path: String) -> McpToolResponse {
    // Logic to trigger render_sequence
    McpToolResponse {
        content: format!("Export started to {}", output_path),
        is_error: false,
    }
}
