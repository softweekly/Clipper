use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::error::Error;

#[derive(Debug, Serialize, Deserialize)]
pub struct OllamaRequest {
    pub model: String,
    pub prompt: String,
    pub stream: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OllamaResponse {
    pub response: String,
}

pub struct OllamaClient {
    pub client: Client,
    pub base_url: String,
}

impl OllamaClient {
    pub fn new(base_url: String) -> Self {
        Self {
            client: Client::new(),
            base_url,
        }
    }

    pub async fn chat(&self, model: &str, prompt: &str) -> Result<String, Box<dyn Error>> {
        let url = format!("{}/api/generate", self.base_url);
        let request = OllamaRequest {
            model: model.to_string(),
            prompt: prompt.to_string(),
            stream: false,
        };

        let res = self.client.post(url)
            .json(&request)
            .send()
            .await?
            .json::<OllamaResponse>()
            .await?;

        Ok(res.response)
    }
}
