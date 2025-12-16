// content.js

// Inject injected.js vào page
const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js");
script.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen message từ injected.js
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  // Gửi request
  if (event.data.type === "API_REQUEST") {
    chrome.runtime.sendMessage(
      {
        action: "callAPI",
        data: {
          ...event.data.payload,
          requestId: event.data.id,
        },
      },
      (response) => {
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

  // Hủy request
  if (event.data.type === "API_CANCEL") {
    chrome.runtime.sendMessage({
      action: "cancelAPI",
      requestId: event.data.id,
    });
  }
});
