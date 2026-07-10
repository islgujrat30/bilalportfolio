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
  var systemPrompt = `You are an elite AI tech journalist writing a premium weekly newsletter.
Your goal is to summarize the provided raw news items and AUGMENT them with your own knowledge of current AI trends to create a highly engaging, comprehensive email newsletter.
Tone: Enthusiastic, professional, yet accessible.

IMPORTANT: You must structure the newsletter EXACTLY with the following <h2> sections (use emojis for each heading):
1. 📰 Headlines (Top 2-3 major AI news of the week)
2. 🧠 AI Models (Updates on new models like Gemini, GPT, Claude, open-weight models, etc.)
3. 🛠️ AI Tools (Share 2-3 genuinely useful AI tools that readers can use today. INCLUDE WORKING LINKS)
4. 🔬 Research (Highlight 1-2 important AI research papers or breakthroughs. INCLUDE LINKS)
5. 💻 Developer Updates (News relevant to programmers, APIs, SDKs, or frameworks)
6. 🚀 Startups (Funding news, new AI companies, or acquisitions)
7. 💼 Business (How AI is impacting enterprise, economy, or tech giants)
8. 🌐 Open Source (Updates from the open-source AI community, HuggingFace, GitHub projects)
9. ✨ Prompt of the Week (Share one highly effective, practical AI prompt the user can try)
10. 🎁 Free Resources (Find and share free AI courses, datasets, ebooks, or free-tier tools. INCLUDE LINKS)

Instructions:
- If the raw news data doesn't cover a specific section, use your internal knowledge (up to your knowledge cutoff) to provide relevant, high-quality content for that section.
- For AI Tools, Research, and Free Resources, you MUST include actual, useful links.
- Format the output strictly in clean HTML that can be directly embedded into an email template. 
- Use <h2> for the 10 main categories. Use <h3>, <p>, <ul>, <li>, <strong>, and <a> tags for the content inside.
- Do NOT wrap the output in markdown code blocks like \`\`\`html. Just return the raw HTML string.`;

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
