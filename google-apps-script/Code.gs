// ============================================================
//  BILAL PORTFOLIO - Contact Form Automation
//  Google Apps Script (Apps Script Web App)
// ============================================================
//
//  HOW TO DEPLOY:
//  1. Go to https://script.google.com  →  New Project
//  2. Paste this entire code into the editor
//  3. Replace OWNER_EMAIL below with your Gmail (bilalfaz666@gmail.com)
//  4. Replace SHEET_ID below with your Google Sheet ID
//     (Create a blank Google Sheet, copy the ID from the URL:
//      https://docs.google.com/spreadsheets/d/  >>THIS_PART<<  /edit)
//  5. Click Deploy → New Deployment → Web App
//     - Execute as: Me
//     - Who has access: Anyone
//  6. Click Deploy → Copy the Web App URL
//  7. Paste that URL into src/App.jsx  →  const APPS_SCRIPT_URL = "PASTE_HERE"
//  8. Rebuild & redeploy portfolio (npm run build → push to GitHub)
// ============================================================

const OWNER_EMAIL = "bilalfaz666@gmail.com";   // <-- YOUR EMAIL
const SHEET_ID    = "1-L2FQXN-DbrqgSDjzV1ABS75bwGadUXXCHcrK00SmlI"; // <-- YOUR SHEET ID

// ---- Main handler ----
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const name    = data.name    || "Unknown";
    const email   = data.email   || "";
    const message = data.message || "";
    const time    = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    // 1️⃣  Save to Google Sheet
    saveToSheet(name, email, message, time);

    // 2️⃣  Send confirmation email to the user
    sendUserConfirmation(name, email);

    // 3️⃣  Send notification email to you (Bilal)
    sendOwnerNotification(name, email, message, time);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---- Save submission to Google Sheet ----
function saveToSheet(name, email, message, time) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#1a1a2e").setFontColor("#64ffda");
  }

  sheet.appendRow([time, name, email, message]);
}

// ---- Send confirmation email to the user ----
function sendUserConfirmation(name, email) {
  const subject = "✅ Got your message! — Muhammad Bilal";
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { margin:0; padding:0; background:#0a0f1e; font-family:'Segoe UI',sans-serif; }
        .container { max-width:560px; margin:40px auto; background:#0d1526; border-radius:16px; overflow:hidden; border:1px solid rgba(100,255,218,0.15); }
        .header { background:linear-gradient(135deg,#0d1526 0%,#162040 100%); padding:40px 40px 30px; text-align:center; border-bottom:1px solid rgba(100,255,218,0.1); }
        .logo { font-size:2rem; font-weight:900; color:#64ffda; letter-spacing:2px; }
        .body { padding:36px 40px; }
        h1 { color:#e2e8f0; font-size:1.5rem; font-weight:700; margin:0 0 12px; }
        p { color:#94a3b8; font-size:1rem; line-height:1.7; margin:0 0 16px; }
        .highlight { color:#64ffda; font-weight:600; }
        .quote-box { background:rgba(100,255,218,0.05); border-left:3px solid #64ffda; border-radius:0 8px 8px 0; padding:14px 18px; margin:20px 0; }
        .quote-box p { color:#cbd5e1; margin:0; font-style:italic; }
        .footer { background:#0a0f1e; padding:24px 40px; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
        .footer p { color:#475569; font-size:0.85rem; margin:0; }
        .footer a { color:#64ffda; text-decoration:none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">MB</div>
        </div>
        <div class="body">
          <h1>Hey ${name}! 👋</h1>
          <p>Thank you so much for reaching out through my portfolio. Your message has been received successfully!</p>
          <div class="quote-box">
            <p>I'll personally review your message and get back to you within <span class="highlight">1–2 hours</span>. Looking forward to connecting with you!</p>
          </div>
          <p>In the meantime, feel free to explore my work or connect with me on social media.</p>
          <p>Best regards,<br/><span class="highlight">Muhammad Bilal</span><br/>IT Professional &amp; Developer</p>
        </div>
        <div class="footer">
          <p>📧 <a href="mailto:bilalfaz666@gmail.com">bilalfaz666@gmail.com</a> &nbsp;|&nbsp; 📞 +92325-8125893</p>
          <p style="margin-top:8px;">Kharian, Gujrat, Pakistan</p>
        </div>
      </div>
    </body>
    </html>
  `;

  GmailApp.sendEmail(email, subject, "", { htmlBody });
}

// ---- Send notification email to Bilal ----
function sendOwnerNotification(name, email, message, time) {
  const subject = `🔔 New Contact Form Submission — ${name}`;
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { margin:0; padding:0; background:#0a0f1e; font-family:'Segoe UI',sans-serif; }
        .container { max-width:560px; margin:40px auto; background:#0d1526; border-radius:16px; overflow:hidden; border:1px solid rgba(100,255,218,0.15); }
        .header { background:linear-gradient(135deg,#0d1526 0%,#162040 100%); padding:32px 40px; border-bottom:1px solid rgba(100,255,218,0.1); }
        .header h2 { color:#64ffda; font-size:1.1rem; margin:0; letter-spacing:1px; text-transform:uppercase; }
        .body { padding:36px 40px; }
        .field { margin-bottom:20px; }
        .label { color:#64ffda; font-size:0.8rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px; }
        .value { color:#e2e8f0; font-size:1rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px 16px; line-height:1.6; }
        .footer { background:#0a0f1e; padding:20px 40px; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
        .footer p { color:#475569; font-size:0.85rem; margin:0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Portfolio Inquiry</h2>
        </div>
        <div class="body">
          <div class="field">
            <div class="label">Received At</div>
            <div class="value">${time}</div>
          </div>
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${email}" style="color:#64ffda;">${email}</a></div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${message}</div>
          </div>
        </div>
        <div class="footer">
          <p>This notification was sent automatically from your portfolio contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  GmailApp.sendEmail(OWNER_EMAIL, subject, "", { htmlBody });
}
