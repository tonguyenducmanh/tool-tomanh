// background.js - Service Worker (MV3)

const abortControllers = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAPI") {
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
