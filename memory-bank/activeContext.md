# Active Context

## Current Development Focus

### Trạng Thái Hiện Tại
- Dự án đang ở giai đoạn phát triển ban đầu
- Memory Bank vừa được khởi tạo
- Cần triển khai các công cụ cốt lõi

### Ưu Tiên Hiện Tại
1. Hoàn thiện cấu trúc dự án
2. Triển khai các công cụ theo thứ tự ưu tiên:
   - JSON Tools (Parser, Mapper, Converter)
   - Code Tools (SQL Formatter, Compare)
   - Image Tools (Base64, QR Code)
   - Text Tools (UUID, Compression)
   - Developer Tools (Color, VSCode, OTP)

### Quyết Định Đang Chờ
- Chiến lược cache cho từng loại công cụ
- UI/UX flow cho các công cụ phức tạp
- Cơ chế lưu trữ lịch sử sử dụng

## Technical Considerations

### Đang Thực Hiện
- Setup cơ sở dự án với Vue 3 + Vite
- Cấu hình Electron cho desktop app
- Thiết lập hệ thống i18n

### Cần Xem Xét
- Performance optimization cho các công cụ xử lý file lớn
- Memory management cho cache system
- Error handling strategy
- Testing approach

## Next Steps

### Immediate Tasks
1. Triển khai core components (Button, Input, Textarea...)
2. Setup cache system với IndexedDB và In-Memory
3. Implement JSON Parser tool
4. Setup routing system
5. Configure i18n với các ngôn ngữ support

### Upcoming Features
1. JSON Tools
   - Parser với syntax highlighting
   - Mapper với drag-n-drop interface
   - Converter với template system

2. Code Tools
   - SQL Formatter với multiple dialect support
   - Code Compare với diff highlighting

### Backlog
- History feature cho mỗi công cụ
- Export/Import settings
- Keyboard shortcuts
- Theme support

## Current Challenges
1. Performance với large JSON files
2. Cache strategy cho different data types
3. Offline functionality implementation
4. Cross-platform compatibility

## Recent Changes
- Khởi tạo Memory Bank
- Setup project structure
- Define core architecture

## Notes & Observations
- Cần focus vào UX cho developer workflow
- Consider adding more developer tools trong tương lai
- Theo dõi performance với các file kích thước lớn
