use axum::{
    routing::{get, post},
    extract::State,
    Json, Router,
};
use serde_json::{Value, json};
use std::sync::Arc;
use td_tool_model::{UIAPIRequest, UIAPIResponse};
use td_tool_agent::execute_request;
use serde_json;
struct AppState {
    // todo: bổ sung body
}

#[tokio::main]
async fn main() {
    let shared_state = Arc::new(AppState {});

    let app = Router::new()
        .route("/", get(health_check))
        .route("/exec", post(exec_call_api))
        .with_state(shared_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:7777")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "Ok"
}

async fn exec_call_api(
    State(_state): State<Arc<AppState>>,
    Json(body): Json<UIAPIRequest>
) -> Json<UIAPIResponse> {
    let response = execute_request(body).await;
    let res = response.expect("Đã có lỗi xảy ra");
    Json(res)
}