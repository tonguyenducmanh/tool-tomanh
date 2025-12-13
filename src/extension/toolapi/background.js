// Background Service Worker - Handles API requests and CORS bypass
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAPI") {
    handleAPICall(request.data).then(sendResponse).catch((error) => {
      sendResponse({
        success: false,
        error: error.message,
        status: null,
        body: null,
      });
    });
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

/**
 * Make an API call without CORS restrictions
 * @param {Object} data - API request data
 * @param {string} data.url - API endpoint URL
 * @param {string} data.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {Object} data.headers - Request headers
 * @param {string} data.body - Request body (for POST, PUT, PATCH)
 * @returns {Promise<Object>} Response object
 */
async function handleAPICall(data) {
  const { url, method, headers, body } = data;

  if (!url) {
    throw new Error("URL is required");
  }

  const options = {
    method: method || "GET",
    headers: headers || {},
  };

  // Add body for applicable methods
  if (body && ["POST", "PUT", "PATCH"].includes(options.method)) {
    options.body = body;
  }

  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");
    let responseBody;

    // Parse response based on content type
    if (contentType && contentType.includes("application/json")) {
      try {
        responseBody = await response.json();
      } catch (e) {
        responseBody = await response.text();
      }
    } else if (contentType && contentType.includes("text")) {
      responseBody = await response.text();
    } else {
      responseBody = await response.text();
    }

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody,
      contentType: contentType,
    };
  } catch (error) {
    throw new Error(`API Call Failed: ${error.message}`);
  }
}
