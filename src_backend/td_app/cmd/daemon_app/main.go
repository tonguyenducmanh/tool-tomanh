package main

import (
	"sync"
	apiApp "td_app/internal/api_app"
	startUp "td_app/internal/common"
	webApp "td_app/internal/web_app"
)

/**
 * khởi chạy api app + web app
 */
func main() {
	config := startUp.HandleStartUpLogic()
	apiPort := &config.APIConfig.Port
	apiTrace := &config.APIConfig.EnableTrace
	mockPort := &config.MockAPIConfig.Port
	webPort := &config.WebConfig.Port
	webTrace := &config.WebConfig.EnableTrace

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		apiApp.RunAPIApp(apiPort, mockPort, apiTrace)
	}()

	go func() {
		defer wg.Done()
		webApp.RunWebApp(webPort, webTrace)
	}()

	wg.Wait() // chờ 2 service chạy xong
}
