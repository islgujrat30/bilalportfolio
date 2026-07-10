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
    // Log the error securely
    logToSheet("ERROR", "doPost Error: " + globalError.message);
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

  // 3. Database Check
  var existingUser = getSubscriber(email);
  
  if (existingUser) {
    if (existingUser.status === "Active") {
      return createJsonResponse({ status: "success", message: "You are already subscribed!" });
    } else {
      // Reactivate
      updateSubscriberStatus(existingUser.row, "Active");
      logToSheet("INFO", "Subscriber reactivated: " + email);
      return createJsonResponse({ status: "success", message: "Subscription reactivated successfully!" });
    }
  }

  // 4. New Subscription
  var token = generateUniqueToken();
  addSubscriber(name, email, token);
  logToSheet("INFO", "New subscriber added: " + email);

  return createJsonResponse({
    status: "success",
    message: "Successfully subscribed to AI Weekly Digest."
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
