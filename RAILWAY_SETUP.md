# Railway Deployment Guide - Pravasi Jaalakam

Complete guide to deploy Pravasi Jaalakam to Railway after pushing to GitHub.

## Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Code ready to push

## Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not already done)

```bash
cd "/Users/apple/Desktop/Pravasi Jalakam/Pravasi Source code "

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Pravasi Jaalakam project setup"
```

### 1.2 Connect to GitHub Repository

```bash
# Add remote repository
git remote add origin https://github.com/Sabuanchuparayil/Pravasijalakam.git

# Verify remote
git remote -v
```

### 1.3 Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

**Note:** If the repository already has content, you may need to:
```bash
git pull origin main --allow-unrelated-histories
# Resolve any conflicts, then:
git push -u origin main
```

## Step 2: Set Up Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up or log in (you can use GitHub to sign in)
3. Verify your email if required

## Step 3: Create Railway Project

1. Click **"New Project"** in Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub account (if first time)
4. Select repository: **`Sabuanchuparayil/Pravasijalakam`**
5. Click **"Deploy Now"**

## Step 4: Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. **Important:** Copy the `DATABASE_URL` from the service variables
   - Click on the PostgreSQL service
   - Go to **"Variables"** tab
   - Copy the `DATABASE_URL` value

## Step 5: Set Up Backend Service

### 5.1 Add Backend Service

1. In Railway project, click **"New"**
2. Select **"GitHub Repo"** (if not already added)
3. Select **`Sabuanchuparayil/Pravasijalakam`**
4. Railway will detect it's a monorepo

### 5.2 Configure Backend Service

1. Click on the service (or create new one)
2. Go to **"Settings"** tab
3. Set **Root Directory** to: `/backend`
4. Go to **"Variables"** tab and add:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=<paste-from-postgres-service>
CLERK_SECRET_KEY=sk_test_0WZdgRtq4rpIBcZujABLpRgAbY49i43yTgIqkYmJuQ
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENTRY_DSN=your_sentry_dsn
CORS_ORIGIN=https://your-web-app.railway.app
```

### 5.3 Configure Build Settings

1. Go to **"Settings"** → **"Build & Deploy"**
2. **Build Command:** `npm install && npm run build && npm run db:generate`
3. **Start Command:** `npm start`
4. **Watch Paths:** `/backend/**`

### 5.4 Generate Custom Domain (Optional)

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"** or add custom domain
3. Copy the domain (e.g., `pravasi-backend.railway.app`)

## Step 6: Set Up Web Service

### 6.1 Add Web Service

1. In Railway project, click **"New"**
2. Select **"GitHub Repo"**
3. Select **`Sabuanchuparayil/Pravasijalakam`**

### 6.2 Configure Web Service

1. Click on the web service
2. Go to **"Settings"** tab
3. Set **Root Directory** to: `/web`
4. Go to **"Variables"** tab and add:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-web-app.railway.app
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/graphql
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVnaWJsZS1xdWV0emFsLTMyLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_0WZdgRtq4rpIBcZujABLpRgAbY49i43yTgIqkYmJuQ
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 6.3 Configure Build Settings

1. Go to **"Settings"** → **"Build & Deploy"**
2. **Build Command:** `npm install && npm run build`
3. **Start Command:** `npm start`
4. **Watch Paths:** `/web/**`

### 6.4 Generate Custom Domain

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the domain (e.g., `pravasi-web.railway.app`)

## Step 7: Run Database Migrations

After the backend service is deployed:

1. Go to backend service in Railway
2. Click **"Deployments"** tab
3. Find the latest deployment
4. Click **"View Logs"** or use Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run --service backend npm run db:migrate
```

**Or use Railway's built-in terminal:**
1. Go to backend service
2. Click **"Deployments"** → **"View Logs"**
3. Or use **"Settings"** → **"Connect"** for SSH access

## Step 8: Update Environment Variables

After getting the actual domains:

1. **Backend Service:**
   - Update `CORS_ORIGIN` with your web app URL
   - Update any other service URLs

2. **Web Service:**
   - Update `NEXT_PUBLIC_API_URL` with your backend GraphQL URL
   - Update `NEXT_PUBLIC_APP_URL` with your web app URL

3. **Redeploy** both services after updating variables

## Step 9: Verify Deployment

### Backend Health Check
```bash
curl https://your-backend.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### GraphQL Playground
Visit: `https://your-backend.railway.app/graphql`
- Should show GraphQL Playground
- Try a test query

### Web App
Visit: `https://your-web-app.railway.app`
- Should show the homepage

## Step 10: Configure Clerk for Production

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **"Domains"**
4. Add your Railway domains:
   - Web app domain
   - Backend domain (if needed)
5. Update **Allowed Origins** in Clerk settings

## Troubleshooting

### Build Failures

**Issue:** Build fails with "command not found"
- **Solution:** Check build command in Railway settings
- Ensure Node.js version is correct (Railway auto-detects)

**Issue:** Prisma errors
- **Solution:** Ensure `DATABASE_URL` is set correctly
- Check that migrations have run

### Database Connection Issues

**Issue:** "Cannot connect to database"
- **Solution:** 
  - Verify `DATABASE_URL` is from PostgreSQL service
  - Check database service is running
  - Ensure migrations have run

### Environment Variable Issues

**Issue:** Variables not loading
- **Solution:**
  - Check variable names are correct
  - Ensure `NEXT_PUBLIC_*` prefix for client-side vars
  - Redeploy after adding variables

### CORS Errors

**Issue:** CORS errors in browser
- **Solution:**
  - Update `CORS_ORIGIN` in backend with actual web URL
  - Add domain to Clerk allowed origins
  - Redeploy backend

## Railway CLI Commands (Optional)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run command in service
railway run --service backend npm run db:migrate

# Open service
railway open
```

## Cost Considerations

- **Free Tier:** $5 credit/month
- **PostgreSQL:** ~$5-10/month for small databases
- **Services:** Pay per usage after free tier
- **Recommendation:** Start with free tier, upgrade as needed

## Next Steps After Deployment

1. ✅ Set up custom domains (optional)
2. ✅ Configure SSL certificates (automatic with Railway)
3. ✅ Set up monitoring and alerts
4. ✅ Configure backups for database
5. ✅ Set up CI/CD (automatic with Railway)
6. ✅ Add staging environment (optional)

## Important Notes

- **Never commit `.env` files** - Railway manages these
- **Database migrations** must run after first deployment
- **Environment variables** need to be set in Railway dashboard
- **Custom domains** require DNS configuration
- **Clerk domains** must be added to Clerk dashboard

---

**Your app should now be live on Railway! 🚀**

For more help, check:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

