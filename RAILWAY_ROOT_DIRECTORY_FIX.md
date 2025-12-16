# Railway Root Directory Fix - Step by Step

## ⚠️ CRITICAL: You MUST Set Root Directory in Railway Dashboard

The error you're seeing means Railway is building from the **root** directory instead of `/backend`. 

## 🔧 Fix in Railway Dashboard (REQUIRED)

### Step-by-Step Instructions:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Open your project

2. **Select or Create Backend Service**
   - If you see a service, click on it
   - If no service exists, click **"New"** → **"GitHub Repo"** → Select your repo

3. **Set Root Directory (THIS IS THE KEY FIX)**
   - Click on the service
   - Go to **"Settings"** tab (gear icon)
   - Scroll down to **"Root Directory"** section
   - **Clear any existing value** (if there is one)
   - Type: `backend` (without the leading slash)
   - Click **"Save"** or **"Update"**

4. **Verify Build Settings**
   - Still in Settings → **"Build & Deploy"**
   - **Build Command:** `npm install && npm run build && npm run db:generate`
   - **Start Command:** `npm start`
   - Click **"Save"**

5. **Trigger New Deployment**
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** or wait for automatic redeploy
   - Railway will now build from `/backend` directory

## 📸 Visual Guide

```
Railway Dashboard → Your Service → Settings Tab
├── Root Directory: [backend]  ← SET THIS!
├── Build Command: npm install && npm run build && npm run db:generate
└── Start Command: npm start
```

## ✅ What Should Happen After Fix

Once root directory is set to `backend`, Railway will:
1. ✅ Build from `/backend` directory
2. ✅ Find `backend/package.json` with start script
3. ✅ Run `npm install` in backend folder
4. ✅ Run `npm run build` (creates `dist/index.js`)
5. ✅ Run `npm start` (starts server)

## 🚨 Common Mistakes

- ❌ Setting root directory to `/backend` (with leading slash) - Use `backend` only
- ❌ Not saving after changing root directory
- ❌ Forgetting to redeploy after changing settings
- ❌ Setting root directory on wrong service

## 🔍 How to Verify It's Fixed

After setting root directory and redeploying, check build logs:

**Before Fix (Current Error):**
```
Found workspace with 2 packages
✖ No start command was found
```

**After Fix (Should See):**
```
Building in /backend directory
Running: npm install
Running: npm run build
Starting: npm start
```

## 📝 Alternative: Delete and Recreate Service

If the above doesn't work:

1. **Delete the current service** in Railway
2. **Create new service:**
   - Click **"New"** → **"GitHub Repo"**
   - Select your repository
3. **IMMEDIATELY set root directory to `backend`** before first deploy
4. **Add environment variables**
5. **Deploy**

## 🆘 Still Having Issues?

1. **Check Service Settings:**
   - Root Directory must be exactly: `backend`
   - No leading slash, no trailing slash

2. **Check Build Logs:**
   - Look for "Building in..." message
   - Should say "Building in backend" not "Building in root"

3. **Verify package.json:**
   - File should exist at: `backend/package.json`
   - Should have: `"start": "node dist/index.js"`

4. **Contact Support:**
   - Railway Discord: https://discord.gg/railway
   - Or check Railway docs: https://docs.railway.app

---

**Remember: The root directory setting is the KEY to fixing this error!**

