import { v4 as uuidv4 } from "uuid";
import JSON5 from "json5";
import { toast } from "@/common/TDToastUtil.js";
import i18nData, { loadLocale } from "@/i18n/i18nData.js";

/**
 * các method TDutility dùng cho toàn bộ frontend
 * Created by tdmanh1 19.09.2024
 */
class TDUtility {
  /**
   * Thực hiện duyệt từng phần tử của bảng hoặc thuộc tính của object để call fn
   * @param {Array/Object/...} obj
   * @param {Function} fn hàm thực hiện khi for
   * Created by tdmanh1 19.09.2024
   */
  forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }

    // Force an array if not already something
    if (typeof obj !== "object") {
      obj = [obj];
    }

    if (obj instanceof Array) {
      // Duyệt từng phần tử của mảng
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // nếu là Object thì duyệt từng thuộc tính
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * hoãn việc chạy function khau khi người dùng thao tác lặp đi lặp lại liên tục
   * @param {*} func function sẽ chạy sau 1 khoảng thời gian
   * @param {*} delay thời gian delay
   * @returns
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  /**
   * định dạng ngày tháng
   */
  formatDate(date) {
    const pad = (n) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * clone 1 object để tránh reference
   * @param {object} obj
   */
  cloneDeep(obj) {
    return structuredClone(obj);
  }

  /**
   * copy dữ liệu vào bộ nhớ tạm
   * @param {string} value
   */
  copyToClipboard(value) {
    let me = this;
    navigator.clipboard.writeText(value);
    toast.success(null, i18nData.global.t("i18nCommon.toastMessage.copy"));
  }

  /**
   * tạo uuid v4 mới
   * @returns uuid
   */
  newGuid() {
    return uuidv4();
  }

  /**
   * thiết lập chủ đề giao diện ứng dụng
   * @param {string} currentTheme
   */
  setTheme(currentTheme) {
    document.body.setAttribute("data-theme", currentTheme);
  }

  /**
   * apply giá trị mock ( fake data ) cho 1 file vue, đỡ phải nhập liệu nhiều
   * @param  vm vue instance
   * @param {object} mockObj dữ liệu fake
   */
  applyMock(vm, mockObj) {
    if (vm && vm.$data && typeof vm.$data == "object" && mockObj) {
      for (const [key, value] of Object.entries(mockObj)) {
        vm.$data[key] = value;
      }
      toast.success(
        null,
        i18nData.global.t("i18nCommon.toastMessage.applyMockSuccess")
      );
    }
  }

  getValueByPath(obj, path) {
    const regex = /(?:\[(["'])(.*?)\1\])|(?:\[(\d+)\])|(?:\.?([^.\[\]]+))/g;
    const keys = [];
    let match;

    while ((match = regex.exec(path)) !== null) {
      if (match[2] !== undefined) {
        // bracket string: ["web-app"]
        keys.push(match[2]);
      } else if (match[3] !== undefined) {
        // bracket index: [0]
        keys.push(Number(match[3]));
      } else if (match[4] !== undefined) {
        // dot or bareword: .key or key
        keys.push(match[4]);
      }
    }

    return keys.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
  }

  getKeyByValue(obj, value) {
    for (const key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null; // hoặc giá trị mặc định nếu không tìm thấy
  }

  /**
   * Json parse unsafe
   * @param {*} obj
   * @returns object
   */
  JSONParse(source) {
    let obj = [];
    try {
      obj = JSON.parse(source);
    } catch (error) {
      try {
        obj = JSON5.parse(source);
      } catch (errorSub) {
        console.error("Không thể try parse được bằng JSON5" + errorSub);
      }
    }
    return obj;
  }

  /**
   * copy ảnh từ url
   */
  async copyImageFromUrl(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      await this.copyImageFromBlob(blob);
      toast.success(null, i18nData.global.t("i18nCommon.toastMessage.copy"));
    } catch (error) {
      console.error("❌ Lỗi khi copy ảnh:", error);
      toast.error(null, i18nData.global.t("i18nCommon.toastMessage.error"));
    }
  }
  /**
   * copy ảnh từ blob
   */
  async copyImageFromBlob(blob) {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  }
  /**
   * Tạo file tải xuống từ buffer
   */
  createDownloadFileFromBuffer(buffer, type, fileName) {
    // Tạo blob và mở popup tải file
    const blob = new Blob([buffer], {
      type: type,
    });
    if (blob) {
      this.createDownloadFileFromBlob(blob, fileName);
    }
  }
  /**
   * Tạo file tải xuống từ blob
   */
  createDownloadFileFromBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    this.createDownloadFileFromUrl(url, fileName);
  }
  /**
   * Tạo file tải xuống từ url file
   */
  createDownloadFileFromUrl(url, fileName) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
  /**
   * Chuyển ArrayBuffer -> Base64 string
   */
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
  }

  /**
   * Chuyển Base64 string -> ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Đóng băng sâu một object, ngăn chặn mọi thay đổi ở mọi cấp độ
   * @param {Object} obj Object cần đóng băng
   * @returns {Object} Object đã được đóng băng hoàn toàn
   * Created by tdmanh1 17.06.2025
   */
  freezeDeepObject(obj) {
    // Lấy tất cả thuộc tính của object, bao gồm cả thuộc tính không liệt kê được
    const propNames = Object.getOwnPropertyNames(obj);

    // Đóng băng các thuộc tính trước khi đóng băng object cha
    propNames.forEach((name) => {
      const prop = obj[name];

      // Nếu prop là object và không null, đệ quy đóng băng nó
      if (prop && typeof prop === "object") {
        this.freezeDeepObject(prop);
      }
    });

    // Đóng băng object cha
    return Object.freeze(obj);
  }
}

export default new TDUtility();
