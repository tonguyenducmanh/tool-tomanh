// background.js - Service Worker (MV3)
async function updateExtensionIcon(tabId, url) {
  if (!tabId || !url) return;

  const domain = new URL(url).hostname;
  const { enabledSites = [] } = await chrome.storage.local.get("enabledSites");

  const enabled = enabledSites.includes(domain);

  await chrome.action.setIcon({
    tabId,
    path: enabled
      ? {
          16: "icons/enabled/icon16.png",
          48: "icons/enabled/icon48.png",
          128: "icons/enabled/icon128.png",
        }
      : {
          16: "icons/disabled/icon16.png",
          48: "icons/disabled/icon48.png",
          128: "icons/disabled/icon128.png",
        },
  });

  await chrome.action.setTitle({
    tabId,
    title: enabled
      ? "tool tomanh api helper (Enabled on this site)"
      : "tool tomanh api helper (Disabled on this site)",
  });
}

const abortControllers = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateIcon") {
    updateExtensionIcon(request.tabId, request.url);
    sendResponse({ success: true });
    return;
  }

  if (request.action === "callAPI") {
    const tabUrl = sender.tab?.url;

    if (!tabUrl) {
      sendResponse({
        success: false,
        error: "No tab context",
      });
      return true;
    }

    const domain = new URL(tabUrl).hostname;

    chrome.storage.local.get("enabledSites", ({ enabledSites = [] }) => {
      if (!enabledSites.includes(domain)) {
        sendResponse({
          success: false,
          error: "Extension is disabled on this site",
          status: null,
          body: null,
        });
        return;
      }

      handleAPICall(request.data)
        .then(sendResponse)
        .catch((error) => {
          sendResponse({
            success: false,
            error: error.message,
            status: null,
            body: null,
          });
        });
    });

    return true;
  }

  if (request.action === "cancelAPI") {
    const { requestId } = request;
    const controller = abortControllers.get(requestId);

    if (controller) {
      controller.abort();
      abortControllers.delete(requestId);
    }

    sendResponse({ success: true });
  }
});

/**
 * Call API with AbortController
 */
async function handleAPICall(data) {
  const { url, method, headers, body, requestId } = data;

  if (!url) throw new Error("URL is required");

  const controller = new AbortController();
  abortControllers.set(requestId, controller);

  const options = {
    method: method || "GET",
    headers: headers || {},
    signal: controller.signal,
  };

  if (body) options.body = body;

  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    abortControllers.delete(requestId);

    let parsedBody = rawText;
    if (contentType.includes("application/json")) {
      try {
        parsedBody = JSON.parse(rawText);
      } catch (_) {}
    }

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: parsedBody,
      contentType,
    };
  } catch (error) {
    abortControllers.delete(requestId);

    if (error.name === "AbortError") {
      throw new Error("Request was cancelled");
    }

    throw new Error(`API Call Failed: ${error.message}`);
  }
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab?.url) updateExtensionIcon(tabId, tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab?.url) {
    updateExtensionIcon(tabId, tab.url);
  }
});
