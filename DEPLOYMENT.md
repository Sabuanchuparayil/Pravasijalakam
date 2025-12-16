# Deployment Guide - Pravasi Jaalakam

## Railway Deployment

This guide covers deploying Pravasi Jaalakam to Railway.

## Prerequisites

1. **Railway Account:** Sign up at [railway.app](https://railway.app)
2. **Railway CLI:** Install via `npm i -g @railway/cli`
3. **Git Repository:** Push code to GitHub/GitLab

## Project Setup on Railway

### 1. Create New Project

- Go to Railway dashboard
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository

### 2. Database Setup

- In Railway project, click "New"
- Select "Database" → "Add PostgreSQL"
- Railway will automatically create a managed PostgreSQL instance
- Copy the `DATABASE_URL` from the service variables

### 3. Backend Service

1. **Add Backend Service:**
   - Click "New" → "GitHub Repo"
   - Select the repository
   - Set root directory to `/backend`

2. **Configure Environment Variables:**
   ```
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=<from-postgres-service>
   CLERK_SECRET_KEY=<your-clerk-secret>
   CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   SENTRY_DSN=<your-sentry-dsn>
   CORS_ORIGIN=<your-web-app-url>
   ```

3. **Build Settings:**
   - Build Command: `npm install && npm run build && npm run db:generate`
   - Start Command: `npm start`

4. **Database Migrations:**
   - After first deployment, run migrations:
   ```bash
   railway run --service backend npm run db:migrate
   ```

### 4. Web Service

1. **Add Web Service:**
   - Click "New" → "GitHub Repo"
   - Select the repository
   - Set root directory to `/web`

2. **Configure Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=<your-web-url>
   NEXT_PUBLIC_API_URL=<your-backend-graphql-url>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret>
   NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
   ```

3. **Build Settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### 5. Redis (Optional)

If you need Redis for caching:

- Click "New" → "Database" → "Add Redis"
- Copy the `REDIS_URL` from service variables
- Add to backend service environment variables

## Environment Separation

### Development
- Use Railway's development branch deployments
- Connect to development database
- Use development API keys

### Staging (Optional)
- Create separate Railway project for staging
- Use staging database and services
- Test before production

### Production
- Use main/master branch
- Production database
- Production API keys
- Enable monitoring and alerts

## Custom Domains

1. **Backend:**
   - Go to backend service settings
   - Click "Generate Domain" or add custom domain
   - Update CORS_ORIGIN in environment variables

2. **Web:**
   - Go to web service settings
   - Add custom domain
   - Configure DNS records as shown

## Monitoring

- **Logs:** View in Railway dashboard
- **Metrics:** Railway provides basic metrics
- **Errors:** Sentry integration for error tracking
- **Analytics:** Plausible/Mixpanel for user analytics

## CI/CD

Railway automatically deploys on:
- Push to connected branch
- Pull request merges (if configured)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database service is running
- Ensure migrations have run

### Build Failures
- Check build logs in Railway
- Verify all dependencies in package.json
- Ensure Node.js version is compatible

### Runtime Errors
- Check application logs
- Verify environment variables
- Check Sentry for error details

## Backup Strategy

- **Database:** Railway PostgreSQL includes automatic backups
- **Media:** Cloudinary handles media backups
- **Code:** Git repository serves as code backup

## Scaling

- **Horizontal Scaling:** Railway supports multiple instances
- **Database:** Upgrade PostgreSQL plan as needed
- **CDN:** Use Cloudinary CDN for media assets

