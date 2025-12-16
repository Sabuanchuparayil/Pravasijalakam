# Railway Deployment Fix

## Issue
Railway is trying to build from the root directory, but this is a monorepo. Each service needs its own root directory configuration.

## Solution: Configure Root Directory in Railway

### For Backend Service:

1. **Go to Railway Dashboard**
   - Open your project
   - Click on the **backend service** (or create one if it doesn't exist)

2. **Set Root Directory:**
   - Go to **Settings** tab
   - Scroll to **"Root Directory"**
   - Set it to: `/backend`
   - Click **Save**

3. **Configure Build Settings:**
   - Go to **Settings** → **"Build & Deploy"**
   - **Build Command:** `npm install && npm run build && npm run db:generate`
   - **Start Command:** `npm start`
   - Click **Save**

4. **Add Environment Variables:**
   - Go to **Variables** tab
   - Add:
     ```
     NODE_ENV=production
     PORT=4000
     DATABASE_URL=<from-postgres-service>
     CLERK_SECRET_KEY=sk_test_0WZdgRtq4rpIBcZujABLpRgAbY49i43yTgIqkYmJuQ
     CORS_ORIGIN=https://your-web-app.railway.app
     ```

### For Web Service:

1. **Create/Select Web Service**
   - Click **New** → **GitHub Repo**
   - Select your repository

2. **Set Root Directory:**
   - Go to **Settings** tab
   - Set **Root Directory** to: `/web`
   - Click **Save**

3. **Configure Build Settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - Click **Save**

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/graphql
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVnaWJsZS1xdWV0emFsLTMyLmNsZXJrLmFjY291bnRzLmRldiQ
   CLERK_SECRET_KEY=sk_test_0WZdgRtq4rpIBcZujABLpRgAbY49i43yTgIqkYmJuQ
   ```

## Alternative: Use Railway CLI

If you prefer using CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Set root directory for backend service
railway service backend
railway variables set RAILWAY_ROOT_DIR=/backend

# Or use the service command
railway service
# Select backend service
# Then set root directory in dashboard
```

## Important Notes

- **Root Directory is CRITICAL** - Without it, Railway builds from root and can't find the start command
- Each service (backend, web) needs its own service in Railway
- Each service needs its own root directory set
- The `railway.json` in `/backend` folder will be used once root directory is set correctly

## Verification

After setting root directory:
1. Trigger a new deployment
2. Check build logs - should see:
   - Building from `/backend` directory
   - Running `npm install` in backend folder
   - Running `npm run build`
   - Starting with `npm start`

## If Still Having Issues

1. **Delete and recreate the service** with correct root directory from start
2. **Check build logs** for specific errors
3. **Verify package.json** has `start` script (it does: `"start": "node dist/index.js"`)
4. **Ensure build completes** - `dist/index.js` must exist after build

