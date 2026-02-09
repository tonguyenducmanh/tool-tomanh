package banner

import (
	"td_core_service/td_common"
)

const banner = "Dev Tools started - From TDManh with luv"

func PrintBanner() {
	td_common.LogInfo(banner)
}
