# Technical Context

## Technology Stack

### Core Technologies
- **Vue.js 3**: Frontend framework
- **Vite**: Build tool và development server
- **Electron**: Desktop application framework
- **Node.js**: Runtime environment

### Languages
- JavaScript/ECMAScript
- HTML5/CSS3
- SCSS

### Libraries & Frameworks
- **Vue Router**: Client-side routing
- **Vue i18n**: Internationalization
- **QRCode.js**: QR code generation
- **Pako**: Text compression
- **UUID**: UUID generation
- **Color Picker**: Color selection

### Storage & Caching
- **IndexedDB**: Persistent data storage
- **In-Memory Cache**: Performance optimization
- **LocalStorage**: User preferences

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **npm**: Package management

## Development Environment

### Required Software
- Node.js (v14+)
- npm (v6+)
- Git

### Setup Steps
```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run linter
- `npm run test`: Run tests

## Project Structure
```
utility-for-dev/
├── src/                  # Source code
├── public/              # Static assets
├── dist/                # Build output
├── node_modules/        # Dependencies
├── package.json         # Project manifest
└── vite.config.js       # Vite configuration
```

## Configuration Files

### vite.config.js
```javascript
export default {
  plugins: [vue()],
  base: process.env.ELECTRON=="true" ? './' : "/"
}
```

### package.json Dependencies
```json
{
  "dependencies": {
    "vue": "^3.x",
    "vue-router": "^4.x",
    "vue-i18n": "^9.x",
    "electron": "^20.x"
  }
}
```

## Performance Considerations
- Lazy loading cho các công cụ riêng lẻ
- Cache kết quả xử lý phổ biến
- Minimize bundle size
- Optimize asset loading
- Efficient DOM updates

## Security Controls
- Input validation
- Output encoding
- Cross-site scripting (XSS) prevention
- Local-only data processing
- No sensitive data storage

## Testing Strategy
- Unit tests cho utility functions
- Component tests cho Vue components
- Integration tests cho tool workflows
- Manual testing cho UI/UX
- Cross-platform testing

## Deployment Process
- Build production bundle
- Package Electron app
- Generate installers
- Release management
- Auto-update support

## Browser Support
- Chrome/Chromium (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)
