# Technical Context

## Technologies Used

### Core Technologies
1. **Frontend**:
   - HTML5
   - CSS3 (Grid Layout, Flexbox, Media Queries)
   - Vanilla JavaScript (ES6+)

2. **QR Code Libraries**:
   - qrcode.js
   - qrcodegen.js

3. **Storage**:
   - localStorage API

### Development Tools
- Visual Studio Code
- Chrome DevTools
- Git version control

## Technical Specifications

### JavaScript Features
1. **Modern ES6+ Features**:
   ```javascript
   // Destructuring
   const { value } = document.getElementById('text-input');

   // Arrow Functions
   const debounce = (func, delay) => {...};

   // Template Literals
   `Phần ${index + 1}/${total}`;

   // Spread Operator
   [...history].reverse();
   ```

2. **Performance Optimizations**:
   ```javascript
   // Debounce Implementation
   function debounce(func, delay) {
     let timeout;
     return function (...args) {
       clearTimeout(timeout);
       timeout = setTimeout(() => func.apply(this, args), delay);
     };
   }

   // Event Handlers with Debounce
   const debouncedGenerateQRCode = debounce(generateQRCode, 300);
   ```

3. **State Management**:
   ```javascript
   // localStorage Handling
   function saveToHistory(text) {
     const history = getHistory();
     if (text !== history[history.length - 1]) {
       history.push(text);
       if (history.length > 10) history.shift();
       localStorage.setItem('qrHistory', JSON.stringify(history));
     }
   }
   ```

### CSS Architecture
1. **Grid System**:
   ```css
   .qrcode-box {
     display: grid;
     gap: 3rem;
     justify-content: center;
   }

   @media screen and (max-width: 900px) {
     .qrcode-box { grid-template-columns: 1fr; }
   }
   ```

2. **Design System**:
   ```css
   /* Color Palette */
   :root {
     --primary-color: #4caf50;
     --hover-color: #45a049;
     --background-light: #f1f8f1;
     --text-color: #444;
   }
   ```

3. **Responsive Design**:
   - Mobile-first approach
   - Breakpoints at 900px, 1400px, 2100px
   - Flexible grid layouts

## Performance Considerations

### Text Processing
1. **Chunking Algorithm**:
   ```javascript
   function splitTextIntoChunks(text, maxLength) {
     const chunks = [];
     for (let i = 0; i < text.length; i += maxLength) {
       chunks.push(text.slice(i, i + maxLength));
     }
     return chunks;
   }
   ```

2. **Memory Management**:
   - Giới hạn lịch sử 10 items
   - Cleanup references
   - Efficient DOM updates

### Event Handling
1. **Event Optimization**:
   - Debouncing (300ms delay)
   - Event delegation
   - Efficient event listeners

2. **UI Updates**:
   - Batch DOM updates
   - Minimal reflows/repaints
   - CSS transitions for smooth animations

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies
1. **QR Code Generation**:
   - qrcode.js: Lightweight QR code generation
   - qrcodegen.js: Advanced QR code features

2. **Browser APIs**:
   - localStorage
   - DOM Manipulation
   - requestAnimationFrame

## Code Organization
```
project/
├── index.html      # Main HTML structure
├── style.css       # Global styles
├── script.js       # Core application logic
├── qrcode.js      # QR code library
└── qrcodegen.js   # Alternative QR library
```

## Security Considerations
1. **Data Privacy**:
   - Client-side only processing
   - No server communication
   - No sensitive data storage

2. **Code Security**:
   - Input validation
   - Safe DOM manipulation
   - XSS prevention

## Future Technical Improvements
1. **Code Quality**:
   - Add TypeScript support
   - Implement unit tests
   - Add error boundaries

2. **Performance**:
   - Web Workers for heavy processing
   - Service Worker for offline support
   - Resource optimization

3. **Features**:
   - QR code styling options
   - Export functionality
   - Batch processing support
