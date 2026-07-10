/**
 * List of RSS feeds focusing on Artificial Intelligence and Tech.
 * We use these to gather the raw news data.
 */
var RSS_FEEDS = [
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://www.artificialintelligence-news.com/feed/",
  "https://www.wired.com/feed/tag/ai/latest/rss"
];

/**
 * Main function to fetch and aggregate news from the past 7 days.
 * 
 * @returns {Array<Object>} Array of news items (title, link, description, pubDate)
 */
function getWeeklyAINews() {
  var allNews = [];
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  RSS_FEEDS.forEach(function(feedUrl) {
    try {
      var response = UrlFetchApp.fetch(feedUrl, { muteHttpExceptions: true });
      if (response.getResponseCode() === 200) {
        var xmlContent = response.getContentText();
        var items = parseRSS(xmlContent, oneWeekAgo);
        allNews = allNews.concat(items);
      } else {
        logToSheet("ERROR", "Failed to fetch RSS: " + feedUrl + " - Status: " + response.getResponseCode());
      }
    } catch (e) {
      logToSheet("ERROR", "Error fetching/parsing RSS: " + feedUrl + " - " + e.message);
    }
  });

  // Sort by date (newest first)
  allNews.sort(function(a, b) {
    return b.pubDate - a.pubDate;
  });

  // Limit to top 30 items to avoid overwhelming the Gemini API context window
  return allNews.slice(0, 30);
}

/**
 * Parses RSS XML and extracts items published after a certain date.
 * 
 * @param {String} xmlContent - The raw XML string
 * @param {Date} cutoffDate - Only fetch news newer than this date
 * @returns {Array<Object>} Extracted news items
 */
function parseRSS(xmlContent, cutoffDate) {
  var items = [];
  try {
    var document = XmlService.parse(xmlContent);
    var root = document.getRootElement();
    
    // Most RSS feeds have a <channel> element containing <item> elements
    var channel = root.getChild("channel");
    if (!channel) return items;

    var entries = channel.getChildren("item");
    
    entries.forEach(function(entry) {
      var titleStr = "";
      var linkStr = "";
      var descStr = "";
      var pubDateStr = "";

      var titleElement = entry.getChild("title");
      if (titleElement) titleStr = titleElement.getText();

      var linkElement = entry.getChild("link");
      if (linkElement) linkStr = linkElement.getText();

      var descElement = entry.getChild("description");
      if (descElement) {
        // Strip HTML tags for cleaner processing by Gemini
        descStr = descElement.getText().replace(/<[^>]+>/g, '').substring(0, 500);
      }

      var pubDateElement = entry.getChild("pubDate");
      if (pubDateElement) pubDateStr = pubDateElement.getText();

      var pubDate = new Date(pubDateStr);
      
      // Check if it's valid and within the last week
      if (!isNaN(pubDate.getTime()) && pubDate >= cutoffDate) {
        items.push({
          title: titleStr,
          link: linkStr,
          description: descStr,
          pubDate: pubDate
        });
      }
    });
  } catch (e) {
    throw new Error("XML Parsing failed: " + e.message);
  }
  
  return items;
}

/**
 * Formats the raw news items into a single text block for the Gemini Prompt.
 * 
 * @param {Array<Object>} newsItems 
 * @returns {String} Formatted text
 */
function formatNewsForGemini(newsItems) {
  if (!newsItems || newsItems.length === 0) return "No news found this week.";
  
  var text = "Here are the top AI news articles from the past week:\n\n";
  newsItems.forEach(function(item, index) {
    text += (index + 1) + ". " + item.title + "\n";
    text += "Link: " + item.link + "\n";
    text += "Summary: " + item.description + "\n\n";
  });
  
  return text;
}
