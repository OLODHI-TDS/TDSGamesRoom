# TDS Games Room - Automated Deployment Pipeline

## Overview

This repository is configured for automatic deployment to Render. Every push to the `main` branch will automatically trigger a new deployment.

## Setup Instructions

### 1. Connect GitHub Repository to Render

1. **Log in to Render**: Go to [https://render.com](https://render.com)
2. **Navigate to Dashboard**: Click on your dashboard
3. **Create New Web Service** (if not already created):
   - Click "New +" → "Web Service"
   - Select "Build and deploy from a Git repository"
   - Click "Connect GitHub" and authorize Render
   - Select the `OLODHI-TDS/TDSGamesRoom` repository

### 2. Configure the Web Service

Render will automatically detect the `render.yaml` configuration file, but you can also configure manually:

**Basic Settings:**
- **Name**: `tds-games-room` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (this is the branch that will auto-deploy)

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Auto-Deploy**: `Yes` ✅ (This enables the pipeline!)

**Plan:**
- **Free** (or upgrade as needed)

### 3. Environment Variables (Optional)

If needed, add these in the Render dashboard under "Environment":
- `NODE_ENV` = `production`
- `PORT` = `3000` (Render sets this automatically)

### 4. Enable Auto-Deploy

**IMPORTANT**: Make sure "Auto-Deploy" is set to **Yes**

This setting is found in:
- Render Dashboard → Your Service → Settings → Auto-Deploy

When enabled:
- ✅ Every push to `main` branch triggers automatic deployment
- ✅ Every merged Pull Request to `main` triggers automatic deployment
- ✅ No manual intervention needed

### 5. Update HTML File with Render URL

After deployment, update the `SERVER_URL` in `tds-team-games-v2-socketio.html`:

```javascript
// Find this line (around line 420):
const SERVER_URL = 'http://localhost:3000';

// Replace with your Render URL:
const SERVER_URL = 'https://your-service-name.onrender.com';
```

Then commit and push this change - it will auto-deploy!

## How the Pipeline Works

### Deployment Flow:

```
┌─────────────────┐
│  Developer      │
│  commits code   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Push to        │
│  GitHub main    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Render detects │
│  new commit     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Render runs    │
│  npm install    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Render runs    │
│  npm start      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Live on Render │
│  Auto-deployed! │
└─────────────────┘
```

### Deployment Triggers:

1. **Direct Push to Main**:
   ```bash
   git push origin main
   ```
   → Triggers deployment

2. **Merged Pull Request**:
   - Create PR from feature branch
   - Merge PR to `main`
   → Triggers deployment

3. **Manual Deploy** (if needed):
   - Go to Render Dashboard
   - Click "Manual Deploy" → "Deploy latest commit"

## Deployment Configuration File

The `render.yaml` file in the repository root configures:
- Service type (web)
- Node environment
- Build and start commands
- Auto-deploy settings
- Health check endpoint

**Location**: `/render.yaml`

## Monitoring Deployments

### View Deployment Status:

1. **Render Dashboard**:
   - Go to your service
   - Click "Events" tab
   - See all deployments with status (Live, Building, Failed)

2. **GitHub Integration**:
   - GitHub commits will show deployment status
   - Green checkmark = deployed successfully
   - Red X = deployment failed

### Deployment Logs:

- **Render Dashboard** → Your Service → "Logs" tab
- See real-time build and runtime logs
- Useful for debugging deployment issues

## Common Deployment Issues

### Issue 1: Deployment Fails - Missing Dependencies
**Solution**: Make sure `package.json` includes all dependencies
```bash
npm install <package-name> --save
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push origin main
```

### Issue 2: App Crashes After Deployment
**Solution**: Check logs in Render dashboard
- Look for errors in the "Logs" tab
- Common issues: missing environment variables, port conflicts

### Issue 3: Auto-Deploy Not Working
**Solution**:
1. Check "Auto-Deploy" is enabled in Render settings
2. Verify GitHub repository is correctly connected
3. Ensure pushes are going to the `main` branch

### Issue 4: Old Code Still Showing
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check deployment completed successfully in Render dashboard

## Rollback to Previous Version

If a deployment introduces bugs:

1. **Go to Render Dashboard** → Your Service
2. **Click "Events"** tab
3. **Find the previous successful deployment**
4. **Click "Rollback"** button

Or rollback via Git:
```bash
git revert <commit-hash>
git push origin main
```

## Best Practices

### Before Pushing to Main:

1. ✅ Test locally with `npm start`
2. ✅ Ensure all dependencies are in `package.json`
3. ✅ Review changes with `git diff`
4. ✅ Create a PR for code review (optional but recommended)

### Branch Strategy:

```
main (auto-deploys to production)
  ↑
  │ (merge PR)
  │
feature/bug-fix-branch
  ↑
  │ (develop here)
  │
local development
```

### Deployment Checklist:

- [ ] Code tested locally
- [ ] Dependencies updated in package.json
- [ ] No console errors
- [ ] Multiplayer tested with multiple clients
- [ ] PR reviewed and approved
- [ ] Merged to main
- [ ] Monitor Render deployment logs
- [ ] Test live URL after deployment
- [ ] Verify all games work correctly

## Support

### Render Support:
- Documentation: https://render.com/docs
- Status: https://status.render.com
- Community: https://community.render.com

### Project Issues:
- Report bugs: Create an issue in GitHub repository
- Feature requests: Create an issue with enhancement label

## Quick Reference

**Render Dashboard**: https://dashboard.render.com
**Repository**: https://github.com/OLODHI-TDS/TDSGamesRoom
**Config File**: `render.yaml`
**Start Command**: `npm start`
**Build Command**: `npm install`
**Auto-Deploy**: Enabled on `main` branch
