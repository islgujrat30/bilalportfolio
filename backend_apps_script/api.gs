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
    var payload;
    
    // Check if data is URL-encoded form data (from browser fetch)
    if (e && e.parameter && e.parameter.action) {
      payload = e.parameter;
    } 
    // Otherwise try to parse JSON from postData
    else if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseError) {
        return createJsonResponse({ status: "error", message: "Invalid JSON payload." }, 400);
      }
    } else {
      return createJsonResponse({ status: "error", message: "No data provided." }, 400);
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
 * Used primarily for health checks, testing the deployment, and handling Email Unsubscribe clicks.
 */
function doGet(e) {
  // If a user clicks the unsubscribe link in their email:
  // e.parameter will contain { action: "unsubscribe", token: "..." }
  if (e && e.parameter && e.parameter.action === "unsubscribe" && e.parameter.token) {
    return handleUnsubscribe(e.parameter.token);
  }

  // Default GET response (Health check)
  return createJsonResponse({
    status: "success",
    message: "AI Weekly Digest Backend is running.",
    timestamp: new Date().toISOString()
  });
}

/**
 * Handles the 'unsubscribe' GET request when a user clicks the link in their email.
 * It returns an HTML response (a webpage) rather than a JSON response, so the user sees a nice UI.
 * 
 * @param {String} token 
 */
function handleUnsubscribe(token) {
  try {
    var subscriber = getSubscriberByToken(token);
    
    if (subscriber) {
      if (subscriber.status === "Active") {
        updateSubscriberStatus(subscriber.row, "Unsubscribed");
        logToSheet("INFO", "User unsubscribed: " + subscriber.email);
        return getUnsubscribeHtmlPage(true, "You have successfully unsubscribed from the AI Weekly Digest. We're sad to see you go!");
      } else {
        return getUnsubscribeHtmlPage(false, "You are already unsubscribed from our list.");
      }
    } else {
      return getUnsubscribeHtmlPage(false, "Invalid or expired unsubscribe link.");
    }
  } catch (error) {
    logToSheet("ERROR", "Unsubscribe error: " + error.message);
    return getUnsubscribeHtmlPage(false, "An error occurred while processing your request. Please try again later.");
  }
}

/**
 * Generates a premium UI for the unsubscribe confirmation page.
 * 
 * @param {Boolean} isSuccess 
 * @param {String} message 
 * @returns {HtmlOutput}
 */
function getUnsubscribeHtmlPage(isSuccess, message) {
  var icon = isSuccess ? "✅" : "ℹ️";
  var html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe - AI Weekly Digest</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #05080f;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #d1e2fc;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .card {
        background-color: #0a0d16;
        border: 1px solid rgba(102, 255, 213, 0.15);
        border-radius: 16px;
        padding: 40px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }
      .icon {
        font-size: 48px;
        margin-bottom: 20px;
      }
      h1 {
        font-size: 24px;
        margin: 0 0 15px 0;
        color: #ab73fa;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
        color: #9aa3ba;
        margin-bottom: 25px;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background: linear-gradient(90deg, rgba(102, 255, 213, 0.1) 0%, rgba(102, 255, 213, 0.2) 100%);
        color: #66ffd5;
        text-decoration: none;
        border: 1px solid #66ffd5;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      .btn:hover {
        background: rgba(102, 255, 213, 0.3);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">${icon}</div>
      <h1>Unsubscribe</h1>
      <p>${message}</p>
      <a href="https://bilalportfolio.pages.dev" class="btn">Return to Portfolio</a>
    </div>
  </body>
  </html>
  `;
  
  return HtmlService.createHtmlOutput(html)
    .setTitle('Unsubscribe - AI Weekly Digest')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
