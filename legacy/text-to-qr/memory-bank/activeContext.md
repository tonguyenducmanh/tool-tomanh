# Active Context

## Current Focus
Dự án Text-to-QR Code Generator đã được cập nhật với nhiều tính năng mới, tập trung vào trải nghiệm người dùng và hiệu năng.

## Recent Changes
1. Thêm tính năng chia nhỏ và tạo nhiều mã QR khi text vượt quá 1000 ký tự
2. Thêm tính năng lưu lịch sử text đã sử dụng:
   - Lưu tối đa 10 mục gần nhất
   - Lưu vào localStorage để giữ lại giữa các phiên
   - Chỉ lưu khi text khác với lần lưu trước
3. Cải thiện giao diện:
   - Grid layout responsive cho nhiều mã QR (1-4 cột)
   - Thêm phần hiển thị lịch sử với giao diện thân thiện
   - Sử dụng màu chủ đạo #4caf50 xuyên suốt
4. Tối ưu hiệu năng:
   - Thêm debounce cho tất cả các hàm xử lý sự kiện click (300ms)
   - Cải thiện cách hiển thị UI khi có nhiều mã QR

## Current Features
1. Xử lý text:
   - Hỗ trợ mã hóa base64
   - Xóa ký tự xuống dòng
   - Tự động chia nhỏ text dài
2. Tạo mã QR:
   - Hỗ trợ 2 thư viện: qrcode.js và qrcodegen.js
   - Kích thước mã QR: 400px
   - Hiển thị theo grid responsive
3. Quản lý lịch sử:
   - Lưu trữ tự động
   - Xóa từng mục hoặc xóa tất cả
   - Tái sử dụng text với một cú click

## Active Decisions
1. UI/UX:
   - Sử dụng grid layout cho mã QR để tối ưu không gian hiển thị
   - Thiết kế lịch sử dạng pill với các tùy chọn rõ ràng
   - Áp dụng màu chủ đạo #4caf50 xuyên suốt
2. Kỹ thuật:
   - Sử dụng debounce cho tất cả sự kiện click
   - Lưu trữ lịch sử trong localStorage
   - Giới hạn số lượng lịch sử để tối ưu bộ nhớ

## Next Steps
1. Thêm tính năng tải xuống mã QR
2. Tùy chỉnh màu sắc cho mã QR
3. Hỗ trợ thêm các định dạng dữ liệu khác (URL, vCard, etc.)
4. Thêm tùy chọn cho kích thước mã QR
