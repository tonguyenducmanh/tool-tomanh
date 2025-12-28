use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};
use std::sync::Arc;
use td_tool_agent::execute_request;
use td_tool_model::{UIAPIRequest, UIAPIResponse};
use tower_http::cors::{Any, CorsLayer};

struct AppState {
    // todo: bổ sung body
}

#[tokio::main]
async fn main() {
    let shared_state = Arc::new(AppState {});

    // Cấu hình CORS
    let cors = CorsLayer::new()
        .allow_origin(Any) // Cho phép tất cả origins (có thể cấu hình cụ thể hơn)
        .allow_methods(Any) // Cho phép tất cả methods
        .allow_headers(Any); // Cho phép tất cả headers

    let app = Router::new()
        .route("/", get(health_check))
        .route("/exec", post(exec_call_api))
        .with_state(shared_state)
        .layer(cors); // Thêm CORS layer

    let listener = tokio::net::TcpListener::bind("0.0.0.0:7777").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "Ok"
}

async fn exec_call_api(
    State(_state): State<Arc<AppState>>,
    Json(body): Json<UIAPIRequest>,
) -> Json<UIAPIResponse> {
    let response = execute_request(body).await;
    let res = response.expect("Đã có lỗi xảy ra");
    Json(res)
}
