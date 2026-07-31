package common

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"td_app/internal/banner"
	"td_app/internal/scheduler"
	"td_config"
	apiApp "td_core_service/external/api_app"
	"td_core_service/td_common"
)

// Xử lý các kịch bản cần thiết khi run app nói chung
func HandleStartUpLogic() *td_config.TDCenterConfig {
	centerConfig := td_config.GetConfigGlobal()
	banner.PrintBanner()
	apiApp.InitDatabase()
	scheduler.StartScheduler()

	HandleGracefulShutdown()

	return centerConfig
}

// HandleGracefulShutdown lắng nghe tín hiệu đóng app và lưu log trước khi thoát.
// App chạy theo nhiều goroutine nhưng việc ghi file log chỉ xảy ra định kỳ bởi cron,
// nên khi đóng app cần gọi FlushLogFile để không mất log đang nằm trong bộ nhớ.
func HandleGracefulShutdown() {
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, os.Interrupt, syscall.SIGTERM)

	go func() {
		sig := <-ch
		td_common.LogInfo(fmt.Sprintf("Nhận tín hiệu đóng app (%v), đang lưu log...", sig))
		td_common.FlushLogFile()
		os.Exit(0)
	}()
}
