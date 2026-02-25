package main

import (
	startUp "td_app/internal/common"
	apiApp "td_core_service/external/api_app"
)

// khởi chạy api app
func main() {
	startUp.HandleStartUpLogic()
	apiApp.RunAPIApp()
}
