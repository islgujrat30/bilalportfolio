/**
 * The Main Orchestrator Function.
 * This is the function that will be triggered weekly by the Google Apps Script Time-driven trigger.
 * 
 * Flow:
 * 1. Fetch raw news from RSS (scraper.gs)
 * 2. Format it and send to Gemini for Newsletter generation (gemini.gs)
 * 3. Fetch all active subscribers from Google Sheets (database.gs)
 * 4. Generate the final HTML email (email.gs)
 * 5. Send out the emails.
 */
function runWeeklyNewsletterAutomation() {
  logToSheet("INFO", "Weekly Newsletter Automation started.");
  
  try {
    // 1. Fetch News
    var newsItems = getWeeklyAINews();
    if (newsItems.length === 0) {
      logToSheet("INFO", "No AI news found this week. Aborting newsletter.");
      return;
    }
    
    // 2. Prepare raw text and Generate Content with Gemini
    var rawText = formatNewsForGemini(newsItems);
    var newsletterHtmlContent = generateNewsletterWithGemini(rawText);
    
    // 3. Get Subscribers
    var activeSubscribers = getActiveSubscribers();
    if (activeSubscribers.length === 0) {
      logToSheet("INFO", "No active subscribers found. Aborting newsletter dispatch.");
      return;
    }
    
    // 4 & 5. Dispatch Emails (Loop through subscribers)
    var successCount = 0;
    var failCount = 0;
    
    activeSubscribers.forEach(function(sub) {
      try {
        // We will build sendEmail in Phase 8 (email.gs)
        sendEmail(sub.email, sub.name, sub.token, newsletterHtmlContent);
        successCount++;
        
        // Pause briefly to respect Google Apps Script email sending quotas
        Utilities.sleep(500); 
      } catch (emailError) {
        logToSheet("ERROR", "Failed to send email to " + sub.email + ": " + emailError.message);
        failCount++;
      }
    });
    
    logToSheet("INFO", "Newsletter dispatch complete. Success: " + successCount + ", Failed: " + failCount);
    
  } catch (error) {
    logToSheet("ERROR", "Automation failed: " + error.message);
  }
}

/**
 * Helper to fetch all subscribers with "Active" status from the Database.
 * 
 * @returns {Array<Object>} List of subscriber objects
 */
function getActiveSubscribers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Subscribers");
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  var activeSubs = [];
  
  // Skip header (i=1)
  for (var i = 1; i < data.length; i++) {
    // Status is in column 4 (index 3)
    if (data[i][3] === "Active") {
      activeSubs.push({
        name: data[i][1],
        email: data[i][2],
        token: data[i][4]
      });
    }
  }
  
  return activeSubs;
}
