use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct UIAPIRequest {
    // Tên của API
    pub api_url: String,
    // Method của API
    pub http_method: String,
    // dánh sách các header của api, nối với nhau bởi \n
    pub headers_text: String,
    // nội dung body gọi api
    pub body_text: String,
}


#[derive(Debug, Clone)]
pub struct UIAPIResponse{
    // loại status response
    pub status: i16,
    // loại status response dạng text
    pub status_text: String,
    // header response
    pub headers: String,
    // body response
    pub body: String
}