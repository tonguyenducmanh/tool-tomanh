// lib.rs
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};
use tauri::Manager;

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
    request: RequestData,
    signal_id: String,
    state: tauri::State<'_, RequestStore>,
) -> Result<ResponseData, String> {
    // Tạo channel để handle cancel
    let (cancel_tx, cancel_rx) = tokio::sync::oneshot::channel::<()>();
    
    // Lưu cancel sender vào store
    {
        let mut store = state.lock().unwrap();
        store.insert(signal_id.clone(), cancel_tx);
    }

    // Parse method
    let method = request.http_method
        .unwrap_or_else(|| "GET".to_string())
        .to_uppercase();

    // Parse headers
    let mut headers_map = HashMap::new();
    if let Some(headers_text) = &request.headers_text {
        for line in headers_text.lines() {
            let line = line.trim();
            if !line.is_empty() {
                if let Some((key, value)) = line.split_once(':') {
                    headers_map.insert(
                        key.trim().to_string(),
                        value.trim().to_string()
                    );
                }
            }
        }
    }

    // Thực hiện request
    let result = execute_request(
        request.api_url,
        method,
        headers_map,
        request.body_text,
        cancel_rx,
    ).await;

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

async fn execute_request(
    url: String,
    method: String,
    headers: HashMap<String, String>,
    body: Option<String>,
    mut cancel_rx: tokio::sync::oneshot::Receiver<()>,
) -> Result<ResponseData, String> {
    // Tạo HTTP client
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true) // Cho phép self-signed certificates
        .build()
        .map_err(|e| format!("Failed to create client: {}", e))?;

    // Build request
    let mut request_builder = match method.as_str() {
        "GET" => client.get(&url),
        "POST" => client.post(&url),
        "PUT" => client.put(&url),
        "DELETE" => client.delete(&url),
        "PATCH" => client.patch(&url),
        "HEAD" => client.head(&url),
        _ => return Err(format!("Unsupported HTTP method: {}", method)),
    };

    // Thêm headers
    for (key, value) in headers {
        request_builder = request_builder.header(&key, &value);
    }

    // Thêm body
    if let Some(body_text) = body {
        request_builder = request_builder.body(body_text);
    }

    // Build request
    let request = request_builder
        .build()
        .map_err(|e| format!("Failed to build request: {}", e))?;

    // Execute với cancel support
    let response_future = client.execute(request);
    
    tokio::select! {
        result = response_future => {
            match result {
                Ok(response) => {
                    let status = response.status().as_u16();
                    
                    // Parse response headers
                    let mut response_headers = HashMap::new();
                    for (key, value) in response.headers() {
                        if let Ok(value_str) = value.to_str() {
                            response_headers.insert(
                                key.to_string(),
                                value_str.to_string()
                            );
                        }
                    }

                    // Get response body
                    let body = response.text().await
                        .map_err(|e| format!("Failed to read response body: {}", e))?;

                    Ok(ResponseData {
                        status,
                        headers: response_headers,
                        body,
                    })
                }
                Err(e) => Err(format!("Request failed: {}", e)),
            }
        }
        _ = &mut cancel_rx => {
            Err("Request cancelled by user".to_string())
        }
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