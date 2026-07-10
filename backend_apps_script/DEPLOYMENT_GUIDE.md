# AI Weekly Digest - Backend Deployment Guide

Congratulations! All the backend code for your AI Weekly Digest has been written. Since this system relies on your personal Google Account to send free emails and store data securely in Google Sheets, you need to deploy it yourself. 

Just follow these 5 simple steps:

## Step 1: Create a Google Sheet
1. Open your browser and go to [Google Sheets](https://sheets.google.com).
2. Create a **Blank Spreadsheet**.
3. Name it **"AI Weekly Digest DB"** (or anything you like).
4. Click on **Extensions > Apps Script** in the top menu. This will open the Google Apps Script editor.

## Step 2: Copy the Code
In the Apps Script editor, you will see a file named `Code.gs`. Rename it or just create new files to match the ones we've created in the `backend_apps_script` folder.

Create these 6 files in your Apps Script project and copy the code from your local `backend_apps_script` folder into them:
1. `api.gs`
2. `database.gs`
3. `utils.gs`
4. `scraper.gs`
5. `gemini.gs`
6. `email.gs`
7. `automation.gs`
8. `scheduler.gs`

*(You can also just copy all the code from all these files and paste it into a single `Code.gs` file if you prefer simplicity. It will work exactly the same!)*

## Step 3: Add Your Gemini API Key
1. In the Apps Script Editor, go to **Project Settings** (the gear icon ⚙️ on the left sidebar).
2. Scroll down to **Script Properties** and click **Add script property**.
3. Under **Property**, type exactly: `GEMINI_API_KEY`
4. Under **Value**, paste your actual Google Gemini API key.
5. Click **Save script properties**.

## Step 4: Run Initial Setup
1. Go back to the **Editor** (`<>` icon).
2. Open the file containing `setupDatabase()` (from `database.gs`).
3. Select `setupDatabase` from the dropdown menu at the top and click **Run**.
   * *Google will ask for permissions. Click "Review permissions", choose your account, click "Advanced", and then "Go to project (unsafe)". Click "Allow".*
4. Next, select `createWeeklyTrigger` (from `scheduler.gs`) from the dropdown and click **Run**.
   * *This will schedule your newsletter to be sent automatically every Friday at 10 AM!*

## Step 5: Deploy the Web App
1. At the top right of the Apps Script editor, click the blue **Deploy** button, then select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the details:
   - **Description**: `V1 Production`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: This allows your portfolio frontend to send data to it without requiring visitors to log in)*
4. Click **Deploy**.
5. Copy the **Web app URL** that is generated.

## Final Step: Connect to Your Portfolio
1. Open your portfolio code in VS Code.
2. Go to `src/AIDigestSubscribe.jsx`.
3. Find this line (around line 14):
   ```javascript
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_PLACEHOLDER/exec";
   ```
4. Replace that placeholder URL with the real **Web app URL** you just copied.
5. Run `npm run build` and push your changes to GitHub/Cloudflare.

**🎉 That's it! Your AI Weekly Digest Automation System is now live, free, and fully automated!**
