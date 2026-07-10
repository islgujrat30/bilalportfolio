/**
 * Fetches the Gemini API Key from Google Apps Script Script Properties.
 * Setup: Go to Project Settings -> Script Properties -> Add "GEMINI_API_KEY".
 */
function getGeminiApiKey() {
  var props = PropertiesService.getScriptProperties();
  return props.getProperty("GEMINI_API_KEY");
}

/**
 * Sends the raw news data to Gemini via REST API and returns a formatted Newsletter.
 * 
 * @param {String} rawNewsText - The formatted output from the scraper
 * @returns {String} The generated newsletter in HTML or Markdown format
 */
function generateNewsletterWithGemini(rawNewsText) {
  var apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    logToSheet("ERROR", "Gemini API Key missing. Please set GEMINI_API_KEY in Script Properties.");
    throw new Error("Gemini API Key not found.");
  }

  // We are using gemini-2.5-flash as it is the current fast/cost-effective model in 2026
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

  // Prompt Engineering
  var systemPrompt = `You are an elite AI tech journalist writing a weekly newsletter.
Your goal is to summarize the following raw news items into a highly engaging, readable, and visually appealing email newsletter format.
Tone: Enthusiastic, professional, yet accessible.

Structure the newsletter as follows:
1. A catchy, warm greeting and a 1-2 sentence hook about this week's AI landscape.
2. "Top 3 AI Breakthroughs": Choose the 3 most important news items. Provide a catchy headline with an emoji, and a 2-3 sentence engaging summary for each. Include the link to the original article at the end of the summary like this: [Read more](link).
3. "Rapid Fire Updates": A bulleted list of 3-4 other interesting news items (just 1 sentence each + link).
4. A friendly sign-off wishing them a great weekend.

Format the output strictly in clean HTML that can be directly embedded into an email template. 
Use <h2>, <h3>, <p>, <ul>, <li>, <strong>, and <a> tags.
Do NOT wrap the output in markdown code blocks like \`\`\`html. Just return the raw HTML string.`;

  var payload = {
    "contents": [
      {
        "parts": [
          {
            "text": systemPrompt + "\n\n=== RAW NEWS DATA ===\n" + rawNewsText
          }
        ]
      }
    ],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 2048
    }
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();
    
    if (responseCode === 200) {
      var json = JSON.parse(responseText);
      if (json.candidates && json.candidates.length > 0) {
        var generatedText = json.candidates[0].content.parts[0].text;
        
        // Clean up markdown code block artifacts if Gemini still includes them
        generatedText = generatedText.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
        
        return generatedText;
      } else {
        throw new Error("No candidates returned from Gemini.");
      }
    } else {
      logToSheet("ERROR", "Gemini API failed. Status: " + responseCode + " Response: " + responseText);
      throw new Error("Gemini API request failed.");
    }
  } catch (e) {
    logToSheet("ERROR", "Error communicating with Gemini: " + e.message);
    throw e;
  }
}

/**
 * Diagnostic tool: Fetches the list of all available models for this specific API key.
 * Run this from the Apps Script editor to see which models are actually accessible.
 */
function testAvailableModels() {
  var apiKey = getGeminiApiKey();
  if (!apiKey) {
    Logger.log("API Key is missing!");
    return;
  }
  
  var url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey;
  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var json = JSON.parse(response.getContentText());
    
    if (json.models) {
      Logger.log("SUCCESS! Here are the models your API key has access to:");
      json.models.forEach(function(m) {
        Logger.log("- " + m.name);
      });
      // Also log it to the sheet so we can easily see it
      logToSheet("INFO", "Available models: " + json.models.map(function(m) { return m.name.split('/')[1]; }).join(", "));
    } else {
      Logger.log("Failed to list models. Response: " + response.getContentText());
      logToSheet("ERROR", "ListModels failed: " + response.getContentText());
    }
  } catch(e) {
    Logger.log("Error: " + e.message);
  }
}
