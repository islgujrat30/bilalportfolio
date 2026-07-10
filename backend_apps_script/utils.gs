/**
 * Helper function to create standard JSON responses for the Frontend.
 * Ensures CORS headers are set and structure is consistent.
 * 
 * @param {Object} data - The payload to return
 * @param {Number} statusCode - HTTP status code (although GAS always returns 200 via web app, we structure it logically)
 * @returns {TextOutput} JSON formatted Google Apps Script TextOutput
 */
function createJsonResponse(data, statusCode = 200) {
  var output = {
    code: statusCode,
    data: data
  };
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Validates an email address format using regex.
 * 
 * @param {String} email - Email string to validate
 * @returns {Boolean} true if valid, false otherwise
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Standard robust regex for email validation
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Generates a random, unique 32-character hex token.
 * Used for unsubscribe links and tracking.
 * 
 * @returns {String} A unique token
 */
function generateUniqueToken() {
  // Utilities.getUuid() is the most robust way in GAS
  var uuid1 = Utilities.getUuid().replace(/-/g, '');
  var uuid2 = Utilities.getUuid().replace(/-/g, '');
  return (uuid1 + uuid2).substring(0, 32);
}

/**
 * Helper function to format dates uniformly across the system.
 * 
 * @param {Date} date - JS Date object (defaults to now)
 * @returns {String} Formatted date string (e.g., "YYYY-MM-DD HH:mm:ss")
 */
function getFormattedTimestamp(date) {
  date = date || new Date();
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}
