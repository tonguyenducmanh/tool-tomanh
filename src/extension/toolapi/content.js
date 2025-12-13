const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js");
script.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Content Script - Listen for messages from web page and relay to background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAPI") {
    // Forward to background worker
    chrome.runtime.sendMessage(request, sendResponse);
    return true;
  }
});

// Also listen for messages from the page via postMessage
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data.type === "API_REQUEST") {
    // Forward to background worker
    chrome.runtime.sendMessage(
      { action: "callAPI", data: event.data.payload },
      (response) => {
        // Send response back to page
        window.postMessage(
          {
            type: "API_RESPONSE",
            id: event.data.id,
            payload: response,
          },
          "*"
        );
      }
    );
  }
});
