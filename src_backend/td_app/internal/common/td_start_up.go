package common

import (
	"td_app/internal/banner"
	apiApp "td_core_service/external/api_app"
	configGlobal "td_core_service/external/config"
)

// Xử lý các kịch bản cần thiết khi run app nói chung
func HandleStartUpLogic() *configGlobal.TDCenterConfig {
	centerConfig := configGlobal.GetConfigGlobal()
	banner.PrintBanner()
	apiApp.InitDatabase()

	return centerConfig
}
