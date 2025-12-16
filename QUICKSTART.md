# Quick Start Guide - Pravasi Jaalakam

Get Pravasi Jaalakam running locally in minutes.

## Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **PostgreSQL** (local or Railway)
- **Flutter SDK** 3.0+ (for mobile development)

## Step 1: Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd pravasi-jaalakam

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install web dependencies
cd ../web && npm install

# Install mobile dependencies (optional)
cd ../mobile && flutter pub get
```

## Step 2: Set Up Services

### Clerk (Authentication)

1. Sign up at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Copy your API keys

### Cloudinary (Media Storage)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret

### PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb pravasi_jaalakam
```

**Option B: Railway PostgreSQL**
1. Create Railway account
2. Add PostgreSQL service
3. Copy DATABASE_URL

## Step 3: Configure Environment

### Backend

```bash
cd backend
cp env.example .env
```

Edit `.env` with your credentials:
- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `CLOUDINARY_*` - From Cloudinary dashboard

### Web

```bash
cd web
cp .env.example .env.local
```

Edit `.env.local`:
- `NEXT_PUBLIC_API_URL` - Backend GraphQL URL (http://localhost:4000/graphql)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard

## Step 4: Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed development data
npm run db:seed
```

## Step 5: Start Development Servers

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:4000`
GraphQL Playground: `http://localhost:4000/graphql`

### Terminal 2: Web

```bash
cd web
npm run dev
```

Web app will run on `http://localhost:3000`

### Terminal 3: Mobile (Optional)

```bash
cd mobile
flutter run
```

## Step 6: Verify Installation

1. **Backend Health Check:**
   - Visit `http://localhost:4000/health`
   - Should return `{"status":"ok"}`

2. **GraphQL Playground:**
   - Visit `http://localhost:4000/graphql`
   - Try a simple query:
   ```graphql
   query {
     literatures(limit: 5) {
       id
       title
     }
   }
   ```

3. **Web App:**
   - Visit `http://localhost:3000`
   - Should see the homepage

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists

### Port Already in Use
- Change `PORT` in backend `.env`
- Change port in `web/package.json` scripts

### Clerk Authentication Errors
- Verify API keys are correct
- Check CORS settings in Clerk dashboard

### Prisma Errors
- Run `npm run db:generate` again
- Check database connection
- Verify migrations ran successfully

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [FEATURES.md](./FEATURES.md) for feature roadmap
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

## Development Tips

- Use GraphQL Playground for API testing
- Check backend logs for debugging
- Use Prisma Studio: `npm run db:studio` (in backend)
- Enable Sentry for error tracking (optional in dev)

---

**Happy coding! 🚀**

