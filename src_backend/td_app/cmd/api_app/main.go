package main

import (
	startUp "td_app/internal/common"
	apiApp "td_core_service/external/api_app"
)

// khởi chạy api app
func main() {
	config := startUp.HandleStartUpLogic()
	port := &config.APIConfig.Port
	mockPort := &config.MockAPIConfig.Port
	trace := &config.APIConfig.EnableTrace
	apiApp.RunAPIApp(port, mockPort, trace)
}
