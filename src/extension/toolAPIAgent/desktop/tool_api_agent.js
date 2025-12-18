import { ipcMain } from "electron";
import axios from "axios";
import https from "https";
const controllerMap = new Map();

function parseHeaders(text = "") {
  const headers = {};
  text.split("\n").forEach((line) => {
    line = line.trim();
    if (!line) return;
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    headers[key] = val;
  });
  return headers;
}

/**
 * Inject 1 số logic vào ipcmain của electron
 */
export function injectIpcMain() {
  // gán hàm vào ipcMain để main.js gọi
  ipcMain.handle("agent:exec", async (_, uiReq, signalId) => {
    const controller = new AbortController();
    controllerMap.set(signalId, controller);

    try {
      const res = await axios({
        url: uiReq.apiUrl,
        method: uiReq.httpMethod,
        headers: parseHeaders(uiReq.headersText),
        data: uiReq.bodyText || undefined,
        signal: controller.signal,
        validateStatus: () => true,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      return res.data;
    } catch (err) {
      if (err.name === "CanceledError") {
        return "Request cancelled by user";
      }

      return err.message;
    } finally {
      controllerMap.delete(signalId);
    }
  });

  ipcMain.on("agent:cancel", (_, signalId) => {
    const controller = controllerMap.get(signalId);
    if (controller) {
      controller.abort();
      controllerMap.delete(signalId);
    }
  });
}
