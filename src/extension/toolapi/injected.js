// injected.js - Script được inject vào page context

(function () {
  "use strict";

  // Injected Script - Simple API helper
  window.__toolTomanh = {
    callAPI: async function (options) {
      return new Promise((resolve, reject) => {
        const id = `api_${Date.now()}_${Math.random()}`;

        // Listen for response
        const listener = (event) => {
          if (event.data.type === "API_RESPONSE" && event.data.id === id) {
            window.removeEventListener("message", listener);
            if (event.data.payload.success) {
              resolve(event.data.payload);
            } else {
              reject(new Error(event.data.payload.error));
            }
          }
        };

        window.addEventListener("message", listener);

        // Send request
        window.postMessage(
          {
            type: "API_REQUEST",
            id: id,
            payload: {
              url: options.url,
              method: options.method || "GET",
              headers: options.headers || {},
              body: options.body || null,
            },
          },
          "*"
        );

        // Timeout
        setTimeout(() => {
          window.removeEventListener("message", listener);
          reject(new Error("API call timeout"));
        }, 30000);
      });
    },
  };
})();
