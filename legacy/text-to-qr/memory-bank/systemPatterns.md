# System Patterns

## Architecture
Text-to-QR Code Generator tuân theo kiến trúc client-side, đảm bảo tương tác nhanh và mượt mà mà không cần xử lý phía server.

## Key Components

1. **HTML**:
   - Cung cấp cấu trúc của ứng dụng
   - Phân chia rõ ràng các vùng chức năng: nhập liệu, lịch sử, hiển thị QR
   - Sử dụng semantic markup cho SEO và accessibility

2. **CSS**:
   - Grid layout cho hiển thị nhiều mã QR
   - Media queries cho responsive design
   - Design system thống nhất với màu chủ đạo #4caf50
   - CSS modular cho dễ bảo trì và mở rộng

3. **JavaScript**:
   - Core functionality: Tạo và hiển thị mã QR
   - History management: Quản lý lịch sử người dùng
   - Performance optimization: Tối ưu hiệu năng
   - Event handling: Xử lý tương tác người dùng

## Design Patterns

1. **Modular Design**:
   - Tách biệt các module theo chức năng
   - Các thư viện QR code độc lập: qrcode.js và qrcodegen.js
   - Tách riêng logic xử lý lịch sử và UI

2. **Event-Driven Programming**:
   - Sử dụng event listeners cho tương tác người dùng
   - Debounce pattern cho tối ưu hiệu năng
   - Event delegation cho các phần tử động

3. **State Management**:
   - Local storage cho lưu trữ lịch sử
   - State validation trước khi lưu
   - Reactive UI updates khi state thay đổi

4. **Progressive Enhancement**:
   - Hoạt động trên mọi trình duyệt hiện đại
   - Graceful degradation cho trình duyệt cũ
   - Responsive design cho mọi kích thước màn hình

5. **Performance Patterns**:
   - Debouncing cho event handlers
   - Lazy loading cho các thành phần không cần thiết
   - Efficient DOM manipulation
   - Memory management cho localStorage

## Component Relationships

1. **Core Components**:
   ```mermaid
   graph TD
     A[script.js] --> B[QR Generation]
     A --> C[History Management]
     A --> D[UI Updates]
     B --> E[qrcode.js]
     B --> F[qrcodegen.js]
     C --> G[localStorage]
     D --> H[DOM Updates]
   ```

2. **Data Flow**:
   ```mermaid
   graph LR
     A[User Input] --> B[Text Processing]
     B --> C[QR Generation]
     B --> D[History Storage]
     D --> E[UI Update]
     C --> E
   ```

3. **Event Flow**:
   ```mermaid
   graph TD
     A[User Events] --> B[Debounce]
     B --> C[Event Handler]
     C --> D[State Update]
     D --> E[UI Update]
     D --> F[Storage Update]
   ```

## Implementation Details

1. **Text Processing**:
   - Chunking text > 1000 ký tự
   - Base64 encoding option
   - Whitespace handling

2. **History Management**:
   - Max 10 items retention
   - FIFO queue implementation
   - Duplicate prevention
   - Atomic storage updates

3. **UI Patterns**:
   - Grid-based layout
   - Responsive breakpoints
   - Interactive elements feedback
   - Loading states

4. **Performance Optimizations**:
   - 300ms debounce cho events
   - Efficient DOM updates
   - Lazy initialization
   - Memory cleanup
