/**
 * Sets up the required sheets if they don't exist.
 * Run this function once from the Apps Script editor.
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Subscribers Sheet
  var subSheet = ss.getSheetByName("Subscribers");
  if (!subSheet) {
    subSheet = ss.insertSheet("Subscribers");
    subSheet.appendRow(["Timestamp", "Name", "Email", "Status", "Unsubscribe_Token"]);
    subSheet.getRange("A1:E1").setFontWeight("bold").setBackground("#d9ead3");
    subSheet.setFrozenRows(1);
  }

  // 2. Setup Logs Sheet (Optional but good for debugging)
  var logSheet = ss.getSheetByName("Logs");
  if (!logSheet) {
    logSheet = ss.insertSheet("Logs");
    logSheet.appendRow(["Timestamp", "Type", "Message"]);
    logSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#fce5cd");
    logSheet.setFrozenRows(1);
  }
}

/**
 * Checks if an email is already in the Subscribers list.
 * 
 * @param {String} email
 * @returns {Object|null} The subscriber record if found, else null
 */
function getSubscriber(email) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Subscribers");
  
  if (!sheet) return null;
  
  var data = sheet.getDataRange().getValues();
  
  // Skip header (i=1)
  for (var i = 1; i < data.length; i++) {
    if (data[i][2].toString().toLowerCase() === email.toLowerCase()) {
      return {
        row: i + 1,
        timestamp: data[i][0],
        name: data[i][1],
        email: data[i][2],
        status: data[i][3],
        token: data[i][4]
      };
    }
  }
  return null;
}

/**
 * Adds a new subscriber to the Google Sheet.
 * 
 * @param {String} name 
 * @param {String} email 
 * @param {String} token 
 */
function addSubscriber(name, email, token) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Subscribers");
  
  // Auto-setup if missing
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName("Subscribers");
  }

  sheet.appendRow([
    getFormattedTimestamp(),
    name,
    email,
    "Active",
    token
  ]);
}

/**
 * Updates the status of an existing subscriber (e.g. if they re-subscribe).
 * 
 * @param {Number} rowNumber
 * @param {String} newStatus 
 */
function updateSubscriberStatus(rowNumber, newStatus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Subscribers");
  
  // Status is column D (4th column)
  sheet.getRange(rowNumber, 4).setValue(newStatus);
}

/**
 * Basic logging utility to write to the Logs sheet.
 * 
 * @param {String} type - e.g., "INFO", "ERROR"
 * @param {String} message 
 */
function logToSheet(type, message) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Logs");
    if (sheet) {
      sheet.appendRow([getFormattedTimestamp(), type, message]);
    }
  } catch (e) {
    // Fail silently if logging fails
  }
}
