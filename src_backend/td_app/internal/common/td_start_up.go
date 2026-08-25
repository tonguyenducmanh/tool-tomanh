package common

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"td_app/internal/banner"
	"td_config"
	apiApp "td_core_service/external/api_app"
	"td_core_service/td_common"
)

// Xử lý các kịch bản cần thiết khi run app nói chung
func HandleStartUpLogic() *td_config.TDCenterConfig {
	centerConfig := td_config.GetConfigGlobal()
	banner.PrintBanner()
	apiApp.InitDatabase()

	HandleGracefulShutdown()

	return centerConfig
}

// HandleGracefulShutdown lắng nghe tín hiệu đóng app và log trước khi thoát.
func HandleGracefulShutdown() {
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, os.Interrupt, syscall.SIGTERM)

	go func() {
		sig := <-ch
		td_common.LogInfo(fmt.Sprintf("Nhận tín hiệu đóng app (%v)", sig))
		os.Exit(0)
	}()
}
