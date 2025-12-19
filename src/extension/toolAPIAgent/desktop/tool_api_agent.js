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
 * Inject logic vào ipcMain
 */
export function injectIpcMain() {
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

      return {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        body: JSON.stringify(res.data),
      };
    } catch (err) {
      if (err.name === "CanceledError") {
        return {
          status: 499,
          statusText: "CANCELLED",
          headers: {},
          body: "Request cancelled by user",
        };
      }

      return {
        status: 500,
        statusText: "ERROR",
        headers: {},
        body: err.message,
      };
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
