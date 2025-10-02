# TDS Team Games - Deployment Guide

## Quick Start - Test Locally First

1. **Install Node.js** (if not already installed): https://nodejs.org/
2. **Install dependencies:**
   ```bash
   cd C:\Users\Omar.Lodhi\Downloads
   npm install
   ```
3. **Start the server:**
   ```bash
   npm start
   ```
4. **Open the game:**
   - Open `tds-team-games-v2-socketio.html` in your browser
   - Server will be running on http://localhost:3000

---

## Free Deployment Options

### Option 1: Glitch (Easiest - No Account Required)

**Pros:**
- Free forever
- No credit card required
- Instant deployment
- Built-in code editor
- Great for testing

**Cons:**
- App sleeps after 5 minutes of inactivity
- Limited resources
- Public URLs

**Steps:**

1. **Go to:** https://glitch.com

2. **Click "New Project" → "Import from GitHub"**

3. **Or manually create:**
   - Click "New Project" → "glitch-hello-node"
   - Delete the example files
   - Upload your files:
     - `server.js`
     - `package.json`
     - `tds-team-games-v2-socketio.html`

4. **Glitch will auto-install dependencies and start your server**

5. **Get your app URL:**
   - Click "Share" button
   - Copy the "Live site" URL (e.g., `https://your-project-name.glitch.me`)

6. **Update your HTML file:**
   - Open `tds-team-games-v2-socketio.html`
   - Find `const SERVER_URL = 'http://localhost:3000';`
   - Change to: `const SERVER_URL = 'https://your-project-name.glitch.me';`
   - Re-upload to Glitch

7. **Open the game:**
   - Visit: `https://your-project-name.glitch.me/tds-team-games-v2-socketio.html`

---

### Option 2: Render.com (More Reliable)

**Pros:**
- Free tier available
- Better performance than Glitch
- Custom domains
- SSL included

**Cons:**
- Requires GitHub account
- App sleeps after 15 minutes of inactivity (free tier)
- Takes ~30 seconds to wake up

**Steps:**

1. **Create GitHub Repository:**
   - Go to https://github.com → "New repository"
   - Name it: `tds-team-games`
   - Initialize with README

2. **Upload your files to GitHub:**
   ```bash
   cd C:\Users\Omar.Lodhi\Downloads
   git init
   git add server.js package.json tds-team-games-v2-socketio.html .gitignore
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/tds-team-games.git
   git push -u origin main
   ```

3. **Deploy to Render:**
   - Go to https://render.com → Sign up (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** tds-team-games
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free
   - Click "Create Web Service"

4. **Wait for deployment** (2-3 minutes)

5. **Get your app URL:**
   - Render will provide a URL like: `https://tds-team-games.onrender.com`

6. **Update your HTML file:**
   - In GitHub, edit `tds-team-games-v2-socketio.html`
   - Change `const SERVER_URL = 'http://localhost:3000';`
   - To: `const SERVER_URL = 'https://tds-team-games.onrender.com';`
   - Commit the change

7. **Render will auto-redeploy** when you push changes

8. **Open the game:**
   - Visit: `https://tds-team-games.onrender.com/tds-team-games-v2-socketio.html`

---

### Option 3: Railway.app (Alternative)

**Pros:**
- $5 free credit per month
- No sleep time
- Fast performance

**Cons:**
- Requires credit card for verification
- Free tier limited to $5/month usage

**Steps:**

1. **Sign up:** https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Connect your repository** (same as Render steps 1-2)
4. **Railway auto-detects** Node.js and deploys
5. **Generate domain** → Settings → Generate Domain
6. **Update HTML** with the Railway URL

---

## After Deployment

### Update the HTML File:

No matter which option you choose, you need to update this line in `tds-team-games-v2-socketio.html`:

```javascript
const SERVER_URL = 'http://localhost:3000';
```

Change to your deployed URL:
```javascript
const SERVER_URL = 'https://your-app-url.com';  // No trailing slash!
```

### Test Your Deployment:

1. **Open the game URL** in your browser
2. **Host creates a room**
3. **Player joins** from a different device/browser
4. **Play a game** to verify everything works

---

## Troubleshooting

### "Connection Error" when joining:
- ✅ Check server is running (visit the base URL, you should see the game)
- ✅ Verify `SERVER_URL` matches your deployment URL exactly
- ✅ Check browser console for errors (F12)
- ✅ Make sure URL uses `https://` not `http://`

### "Room not found":
- ✅ Host must create room first
- ✅ Room codes are case-sensitive
- ✅ Both host and player must use the SAME deployed URL

### App is slow to load:
- Free tiers sleep after inactivity
- First request wakes it up (~30 seconds)
- Keep app active or upgrade to paid tier

### Games not syncing properly:
- ✅ Check all players are on the same server URL
- ✅ Check browser console for connection errors
- ✅ Verify server logs show all connections

---

## Recommended: Glitch for Quick Testing, Render for Production

- **For quick demos:** Use Glitch (instant, no setup)
- **For regular use:** Use Render (more reliable, faster wake time)

---

## Support

If you encounter issues:
1. Check browser console (F12 → Console tab)
2. Check server logs (in Glitch/Render dashboard)
3. Verify all files are uploaded correctly
4. Ensure `SERVER_URL` matches your deployment
