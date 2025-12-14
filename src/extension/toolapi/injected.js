// injected.js - chạy trong page context

(function () {
  "use strict";

  let pendingRequests = new Map();

  window.__toolTomanh = {
    /**
     * callAPI trả về { promise, cancel }
     */
    callAPI(options) {
      let id = `api_${Date.now()}_${Math.random()}`;

      let promise = new Promise((resolve, reject) => {
        let listener = (event) => {
          if (event.data.type === "API_RESPONSE" && event.data.id === id) {
            window.removeEventListener("message", listener);
            pendingRequests.delete(id);

            if (event.data.payload?.success) {
              resolve(event.data.payload);
            } else {
              reject(new Error(event.data.payload?.error || "Unknown error"));
            }
          }
        };

        pendingRequests.set(id, { reject });
        window.addEventListener("message", listener);

        window.postMessage(
          {
            type: "API_REQUEST",
            id,
            payload: {
              url: options.url,
              method: options.method || "GET",
              headers: options.headers || {},
              body: options.body || null,
            },
          },
          "*"
        );
      });

      return {
        promise,
        cancel() {
          window.postMessage(
            {
              type: "API_CANCEL",
              id,
            },
            "*"
          );

          let pending = pendingRequests.get(id);
          if (pending) {
            pending.reject(new Error("Request cancelled by user"));
            pendingRequests.delete(id);
          }
        },
      };
    },
  };
})();
