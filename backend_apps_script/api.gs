/**
 * Main entry point for HTTP POST requests from the Frontend.
 * 
 * Flow:
 * 1. Parses JSON payload.
 * 2. Routes to the appropriate handler based on the "action" field.
 * 3. Returns standard JSON response.
 */
function doPost(e) {
  try {
    // Check if post data exists
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: "error", message: "No data provided." }, 400);
    }

    // Parse incoming JSON payload
    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createJsonResponse({ status: "error", message: "Invalid JSON payload." }, 400);
    }

    var action = payload.action;

    // Route based on action
    if (action === "subscribe") {
      return handleSubscribe(payload);
    } else if (action === "unsubscribe") {
      return handleUnsubscribe(payload); // For future use
    } else {
      return createJsonResponse({ status: "error", message: "Unknown action." }, 400);
    }
    
  } catch (globalError) {
    // Log the error securely (Phase 4 will implement actual logging to Sheets)
    // logError("doPost", globalError.message);
    return createJsonResponse({ status: "error", message: "Internal Server Error" }, 500);
  }
}

/**
 * Handles the 'subscribe' action.
 * Separated to keep doPost clean and maintainable.
 */
function handleSubscribe(payload) {
  var email = payload.email;
  var name = payload.name || "";

  // 1. Validation
  if (!isValidEmail(email)) {
    return createJsonResponse({ status: "error", message: "Invalid email address format." }, 400);
  }

  // 2. Format Data securely
  email = email.toLowerCase().trim();
  name = name.trim();

  // Phase 4 Placeholder:
  // Here we will check if the email exists in Google Sheets.
  // If it does, return an error or reactivate the subscription.
  // If not, generate a token, append a new row, and return success.
  
  // For Phase 3, we mock a successful response.
  var token = generateUniqueToken();

  return createJsonResponse({
    status: "success",
    message: "Successfully subscribed to AI Weekly Digest.",
    mock_token: token // Removed in production, just to show token gen works
  });
}

/**
 * Handles HTTP GET requests.
 * Used primarily for health checks or testing the deployment.
 */
function doGet(e) {
  return createJsonResponse({
    status: "success",
    message: "AI Weekly Digest Backend is running.",
    timestamp: new Date().toISOString()
  });
}
