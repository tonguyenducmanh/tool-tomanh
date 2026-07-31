package common

import (
	"td_app/internal/banner"
	"td_app/internal/scheduler"
	"td_config"
	apiApp "td_core_service/external/api_app"
)

// Xử lý các kịch bản cần thiết khi run app nói chung
func HandleStartUpLogic() *td_config.TDCenterConfig {
	centerConfig := td_config.GetConfigGlobal()
	banner.PrintBanner()
	apiApp.InitDatabase()
	scheduler.StartScheduler()

	return centerConfig
}
