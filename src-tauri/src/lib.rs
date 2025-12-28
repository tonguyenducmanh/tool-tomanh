// lib.rs
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};
use tauri::Manager;
use td_tool_agent::execute_request;
use td_tool_model::{UIAPIRequest, UIAPIResponse};
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RequestData {
    #[serde(rename = "apiUrl")]
    api_url: String,
    #[serde(rename = "httpMethod")]
    http_method: Option<String>,
    #[serde(rename = "headersText")]
    headers_text: Option<String>,
    #[serde(rename = "bodyText")]
    body_text: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResponseData {
    status: u16,
    headers: HashMap<String, String>,
    body: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    error: String,
}

// Quản lý các request đang chạy để có thể cancel
type RequestStore = Arc<Mutex<HashMap<String, tokio::sync::oneshot::Sender<()>>>>;

#[tauri::command]
async fn exec(
    request: UIAPIRequest,
    signal_id: String,
    state: tauri::State<'_, RequestStore>,
) -> Result<UIAPIResponse, String> {

    // Thực hiện request
    let result = execute_request(request).await;

    // Xóa signal khỏi store
    {
        let mut store = state.lock().unwrap();
        store.remove(&signal_id);
    }

    result
}

#[tauri::command]
async fn cancel(
    signal_id: String,
    state: tauri::State<'_, RequestStore>,
) -> Result<(), String> {
    let mut store = state.lock().unwrap();

    if let Some(cancel_tx) = store.remove(&signal_id) {
        let _ = cancel_tx.send(());
        Ok(())
    } else {
        Err("Signal not found".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .manage(RequestStore::default())
        .invoke_handler(tauri::generate_handler![exec, cancel])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}