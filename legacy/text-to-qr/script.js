/**
 * Tạo QR code từ text
 */
function generateQRCode() {
  let sizeQR = 400;
  let maxTextOneChunk = 1000;
  let colorDark = "#000000";
  let colorLight = "#ffffff";
  let qrcodeDiv = document.getElementById("qrcode");
  let qrcodegenLibElement = document.getElementById("qrcodegen-lib");

  // Lấy giá trị từ các input
  let text = getUserInput();
  if (!text) {
    qrcodeDiv.style.display = "none";
    return;
  }

  let textBuild = buildTextBeforeGenQR(qrcodeDiv, text);

  // Lưu text vào lịch sử nếu khác với lần lưu trước
  saveToHistory(text);

  // Nếu độ dài text lớn hơn 1000, chia thành nhiều phần
  let chunks = splitTextIntoChunks(textBuild, maxTextOneChunk);

  // Xóa style cũ nếu có
  qrcodeDiv.removeAttribute("style");

  // Tạo QR code cho từng phần
  chunks.forEach((chunk, index) => {
    let qrContainer = document.createElement("div");
    qrContainer.className = "qr-container";

    // Thêm label nếu có nhiều hơn 1 mã QR
    if (chunks.length > 1) {
      let label = document.createElement("div");
      label.textContent = `Phần ${index + 1}/${chunks.length}`;
      label.style.textAlign = "center";
      label.style.marginBottom = "10px";
      qrContainer.appendChild(label);
    }

    qrcodeDiv.appendChild(qrContainer);

    // kiểm tra check box có sử dụng thư viện qrcodegen hay không
    let usingQRCodeGenLib = qrcodegenLibElement.checked;
    // Nếu có thì sử dụng thư viện qrcodegen.js
    if (usingQRCodeGenLib) {
      generateQRCodeGenJS(
        chunk,
        null,
        sizeQR,
        colorLight,
        colorDark,
        qrContainer
      );
    } else {
      // Nếu không thì sử dụng thư viện qrcode.js
      generateQRCodeJS(qrContainer, chunk, sizeQR, colorLight, colorDark);
    }
  });
}

/**
 * Chia text thành các phần nhỏ hơn với độ dài cho trước
 * @param {string} text - Text cần chia
 * @param {number} maxLength - Độ dài tối đa của mỗi phần
 * @returns {string[]} Mảng các phần text đã chia
 */
function splitTextIntoChunks(text, maxLength) {
  let chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

/**
 * Tiền xử lý text trước khi tạo QR code
 */
function buildTextBeforeGenQR(qrcodeDiv, text) {
  let removeEmptyElement = document.getElementById("remove-empty-checkbox");

  // Xóa QR code cũ nếu có
  if (qrcodeDiv) {
    qrcodeDiv.innerHTML = "";
  }

  // kiểm tra check box có xóa ký tự trắng hay không
  let shouldRemoveEmptyChar = removeEmptyElement
    ? removeEmptyElement.checked
    : false;

  // Nếu có thì xóa ký tự trắng trong text
  let simpleText = shouldRemoveEmptyChar
    ? text.replace(/(\r\n|\n|\r)/gm, "")
    : text;

  return simpleText;
}

/**
 * lấy giá trị từ input text
 * @returns {string} giá trị text từ input
 */
function getUserInput() {
  let inputElement = document.getElementById("text-input");
  let text = inputElement ? inputElement.value.trim() : null;
  return text;
}

/**
 * Tạo QR code bằng thư viện qrcodegen.js
 */
function generateQRCodeGenJS(
  textBuild,
  qrcode,
  sizeQR,
  colorLight,
  colorDark,
  container
) {
  let segs = qrcodegen.QrSegment.makeSegments(textBuild);
  qrcode = qrcodegen.QrCode.encodeSegments(segs, qrcodegen.QrCode.Ecc.LOW);
  
  // Tạo canvas tạm để vẽ QR code
  let canvas = document.createElement('canvas');
  drawCanvasLib1(qrcode, sizeQR, colorLight, colorDark, canvas);
  
  // Tạo img từ canvas
  let img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  img.width = sizeQR;
  img.height = sizeQR;
  
  // Thêm img vào container
  container.appendChild(img);
}

/**
 * Tạo QR code bằng thư viện qrcode.js
 */
function generateQRCodeJS(container, textBuild, sizeQR, colorLight, colorDark) {
  new QRCode(container, {
    text: textBuild,
    width: sizeQR,
    height: sizeQR,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.L, // Độ sai số thấp nhất
  });
}

/**
 * Vẽ QR code lên canvas dành cho library qrcodegen
 */
function drawCanvasLib1(qr, sizeCanvas, lightColor, darkColor, canvas) {
  if (sizeCanvas <= 0) throw new RangeError("Value out of range");
  
  let moduleSize = Math.floor(sizeCanvas / qr.size);
  canvas.width = moduleSize * qr.size;
  canvas.height = moduleSize * qr.size;
  
  let ctx = canvas.getContext("2d");
  // Tắt anti-aliasing để các pixel sắc nét
  ctx.imageSmoothingEnabled = false;
  
  // Vẽ nền trắng
  ctx.fillStyle = lightColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Vẽ các module QR code
  ctx.fillStyle = darkColor;
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y)) {
        ctx.fillRect(
          x * moduleSize,
          y * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }
}

/**
 * Lấy lịch sử text từ localStorage
 * @returns {Array} Mảng các text đã lưu
 */
function getHistory() {
  let history = localStorage.getItem("qrHistory");
  return history ? JSON.parse(history) : [];
}

/**
 * Lưu text vào lịch sử nếu khác với lần lưu trước
 * @param {string} text - Text cần lưu
 */
function saveToHistory(text) {
  try {
    let history = getHistory();
    let lastItem = history[history.length - 1];

    // Chỉ lưu nếu text khác với lần lưu trước
    if (text !== lastItem) {
      history.push(text);
      // Giới hạn số lượng lịch sử lưu trữ
      if (history.length > 10) {
        history.shift(); // Xóa item cũ nhất
      }
      localStorage.setItem("qrHistory", JSON.stringify(history));
      updateHistoryDisplay();
    }
  } catch (error) {
    console.error("Lỗi khi lưu vào history:", error);
    // Lỗi sẽ được bỏ qua để không ảnh hưởng tới luồng chính
  }
}

/**
 * Xóa một item khỏi lịch sử
 * @param {number} index - Vị trí của item cần xóa
 */
function deleteHistoryItem(index) {
  let history = getHistory();
  history.splice(index, 1);
  localStorage.setItem("qrHistory", JSON.stringify(history));
  updateHistoryDisplay();
}

let debouncedDeleteHistoryItem = debounce(deleteHistoryItem, 300);

/**
 * Xóa tất cả lịch sử
 */
function clearAllHistory() {
  localStorage.removeItem("qrHistory");
  updateHistoryDisplay();
}

let debouncedClearAllHistory = debounce(clearAllHistory, 300);

/**
 * Áp dụng text từ lịch sử
 * @param {string} text - Text cần áp dụng
 */
function applyHistoryText(text) {
  document.getElementById("text-input").value = text;
  generateQRCode();
}

let debouncedApplyHistoryText = debounce(applyHistoryText, 300);

/**
 * Cập nhật hiển thị lịch sử
 */
function updateHistoryDisplay() {
  let history = getHistory();
  let historyList = document.getElementById("history-list");
  if (!historyList) return;

  historyList.innerHTML = "";
  historyList.style.display = history.length ? "flex" : "none";

  [...history].reverse().forEach((text, index) => {
    let item = document.createElement("div");
    item.className = "history-item";

    let textSpan = document.createElement("span");
    let displayText = text.length > 50 ? text.slice(0, 50) + "..." : text;
    textSpan.textContent = displayText;
    textSpan.title = text; // Hiển thị text đầy đủ khi hover
    textSpan.addEventListener("click", () => {
      debouncedApplyHistoryText(text);
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.title = "Xóa";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      debouncedDeleteHistoryItem(history.length - 1 - index);
    });

    item.appendChild(textSpan);
    item.appendChild(deleteBtn);
    historyList.appendChild(item);
  });
}

/**
 * Thêm sự kiện cho các nút
 * - Nút "Generate QR Code"
 */
function addEvent() {
  document
    .getElementById("generate-btn")
    .addEventListener("click", debouncedGenerateQRCode);
  document
    .getElementById("qrcodegen-lib")
    .addEventListener("click", debouncedGenerateQRCode);
  document
    .getElementById("qrcode-lib")
    .addEventListener("click", debouncedGenerateQRCode);
}

/**
 * Hàm debounce để giới hạn tần suất gọi hàm
 * @param {Function} func - Hàm cần debounce
 * @param {number} delay - Thời gian chờ (ms)
 * @returns {Function} Hàm đã được debounce
 */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Bọc hàm generateQRCode bằng debounce
let debouncedGenerateQRCode = debounce(generateQRCode, 300);

// Khởi tạo hiển thị lịch sử và thêm event listeners khi trang được load
document.addEventListener("DOMContentLoaded", () => {
  updateHistoryDisplay();
  document
    .getElementById("generate-btn")
    .addEventListener("click", debouncedGenerateQRCode);
  document
    .getElementById("qrcodegen-lib")
    .addEventListener("click", debouncedGenerateQRCode);
  document
    .getElementById("qrcode-lib")
    .addEventListener("click", debouncedGenerateQRCode);
  document
    .getElementById("clear-all-history")
    .addEventListener("click", debouncedClearAllHistory);
});
