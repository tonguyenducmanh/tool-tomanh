# Product Context

## Purpose
Text-to-QR Code Generator là một ứng dụng web client-side, cung cấp giải pháp nhanh chóng và đáng tin cậy để chuyển đổi văn bản thành mã QR. Ứng dụng được thiết kế để xử lý cả văn bản ngắn và dài một cách hiệu quả, với khả năng lưu trữ lịch sử để tái sử dụng.

## Problems Solved
1. **Xử lý text dài**:
   - Tự động chia nhỏ text dài thành nhiều mã QR
   - Hỗ trợ văn bản trên 1000 ký tự
   - Hiển thị rõ ràng với số thứ tự cho từng phần

2. **Quản lý lịch sử**:
   - Lưu trữ và quản lý các text đã sử dụng
   - Tránh nhập lại text đã dùng
   - Dễ dàng xóa lịch sử không cần thiết

3. **Hiệu năng**:
   - Tối ưu hiệu suất với debounce
   - Responsive trên mọi kích thước màn hình
   - Không phụ thuộc vào server

4. **Trải nghiệm người dùng**:
   - Giao diện trực quan và dễ sử dụng
   - Thao tác nhanh chóng với một click
   - Tương tác mượt mà và phản hồi tức thì

## How It Works
1. **Nhập liệu và xử lý**:
   - Nhập text vào textarea
   - Tùy chọn mã hóa base64
   - Tùy chọn xóa ký tự xuống dòng

2. **Tạo mã QR**:
   - Hỗ trợ hai thư viện QR khác nhau
   - Tự động phân chia text dài
   - Hiển thị grid responsive

3. **Quản lý lịch sử**:
   - Lưu tự động sau mỗi lần tạo
   - Giới hạn 10 mục gần nhất
   - Xóa riêng lẻ hoặc toàn bộ

## User Experience Goals
1. **Đơn giản**:
   - Giao diện tối giản, dễ hiểu
   - Các tùy chọn rõ ràng
   - Thao tác trực quan

2. **Nhanh chóng**:
   - Tạo mã QR ngay lập tức
   - Tái sử dụng text dễ dàng
   - Phản hồi tức thì với người dùng

3. **Tiện lợi**:
   - Lưu trữ lịch sử tự động
   - Tái sử dụng với một click
   - Xử lý thông minh text dài

4. **Tin cậy**:
   - Không lưu trữ dữ liệu trên server
   - Hoạt động offline
   - Bảo mật thông tin người dùng

## Design Principles
1. **Tối ưu cho người dùng**:
   - Layout rõ ràng và hợp lý
   - Phản hồi trực quan
   - Màu sắc thống nhất

2. **Hiệu quả**:
   - Tối thiểu số click cần thiết
   - Tự động lưu và cập nhật
   - Xử lý nhanh chóng

3. **Đáng tin cậy**:
   - Hoạt động ổn định
   - Không mất dữ liệu
   - Dễ dàng khôi phục

4. **Mở rộng**:
   - Sẵn sàng cho tính năng mới
   - Dễ dàng nâng cấp
   - Khả năng tùy biến cao
