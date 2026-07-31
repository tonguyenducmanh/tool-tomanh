package scheduler

import (
	tdScheduler "td_core_service/external/scheduler"
)

// Khởi chạy các cron job nền (backup db + ghi log)
func StartScheduler() {
	tdScheduler.StartScheduler()
}
