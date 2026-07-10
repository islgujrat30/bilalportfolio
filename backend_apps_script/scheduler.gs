/**
 * Creates a Time-Driven Trigger to run the Newsletter Automation automatically.
 * 
 * Instructions:
 * - Run this function ONLY ONCE from the Google Apps Script Editor.
 * - It will set up the system to fire `runWeeklyNewsletterAutomation` every Friday.
 */
function createWeeklyTrigger() {
  var functionName = "runWeeklyNewsletterAutomation";
  
  // 1. Check if a trigger for this function already exists to prevent duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === functionName) {
      logToSheet("INFO", "Trigger already exists. Setup aborted.");
      return; // Already setup
    }
  }
  
  // 2. Create the Trigger
  // Schedule it to run Every Friday at 10 AM (in the timezone of the script)
  try {
    ScriptApp.newTrigger(functionName)
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.FRIDAY)
      .atHour(10)
      .create();
      
    logToSheet("INFO", "Successfully created weekly trigger (Friday at 10 AM).");
  } catch (e) {
    logToSheet("ERROR", "Failed to create trigger: " + e.message);
  }
}

/**
 * Utility to delete all triggers (useful for debugging or resetting).
 */
function deleteAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  logToSheet("INFO", "All automatic triggers have been deleted.");
}
