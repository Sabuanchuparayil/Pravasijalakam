# Next Steps - Getting Started with Pravasi Jaalakam

## ✅ What's Already Done

- ✅ Project structure created
- ✅ Dependencies installed
- ✅ Environment files created (`.env` and `.env.local`)
- ✅ Clerk authentication setup improved
- ✅ GraphQL schema and resolvers ready
- ✅ Database schema (Prisma) ready

## 🎯 What to Do Next (Priority Order)

### Step 1: Set Up PostgreSQL Database (REQUIRED)

You need a PostgreSQL database before you can run the backend.

**Option A: Local PostgreSQL (Recommended for Development)**

```bash
# Check if PostgreSQL is installed
psql --version

# If not installed, install it:
# macOS: brew install postgresql@14
# Then start it: brew services start postgresql@14

# Create the database
createdb pravasi_jaalakam

# Or using psql:
psql postgres
CREATE DATABASE pravasi_jaalakam;
\q
```

**Option B: Railway PostgreSQL (Recommended for Production)**

1. Go to [railway.app](https://railway.app)
2. Sign up/login
3. Create new project
4. Click "New" → "Database" → "Add PostgreSQL"
5. Copy the `DATABASE_URL` from the service variables

**Update Backend `.env`:**
```bash
cd backend
# Edit .env and update DATABASE_URL
DATABASE_URL=postgresql://user:password@localhost:5432/pravasi_jaalakam?schema=public
# OR use Railway URL if using Railway
```

### Step 2: Get Clerk API Keys (REQUIRED)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application (legible-quetzal-32)
3. Go to **API Keys**
4. Copy:
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)

**Update Environment Files:**

```bash
# Backend
cd backend
# Edit .env and add:
CLERK_SECRET_KEY=sk_test_your_actual_key_here

# Web
cd ../web
# Edit .env.local and add:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
```

### Step 3: Set Up Database Schema

Once you have PostgreSQL and DATABASE_URL configured:

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run database migrations (creates all tables)
npm run db:migrate

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

### Step 4: Test Backend Server

```bash
cd backend

# Start the development server
npm run dev
```

**Expected Output:**
```
🚀 GraphQL API server ready at http://0.0.0.0:4000/graphql
```

**Test it:**
1. Open browser: `http://localhost:4000/health`
   - Should show: `{"status":"ok","timestamp":"..."}`

2. Open GraphQL Playground: `http://localhost:4000/graphql`
   - Try this query:
   ```graphql
   query {
     literatures(limit: 5) {
       id
       title
     }
   }
   ```

### Step 5: Test Web Application

In a **new terminal**:

```bash
cd web

# Start Next.js development server
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

**Test it:**
- Open browser: `http://localhost:3000`
- You should see the Pravasi Jaalakam homepage

### Step 6: Optional - Set Up Additional Services

**Cloudinary (for image uploads):**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Add to `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

**Sentry (for error tracking):**
1. Sign up at [sentry.io](https://sentry.io)
2. Create a project
3. Get your DSN
4. Add to `backend/.env` and `web/.env.local`:
   ```
   SENTRY_DSN=your_sentry_dsn
   ```

## 🚨 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` format in `.env`
- Ensure database exists: `psql -l | grep pravasi_jaalakam`

### Issue: "CLERK_SECRET_KEY not set"
**Solution:**
- Make sure you've added the key to `backend/.env`
- Key should start with `sk_test_` or `sk_live_`
- Restart the backend server after adding

### Issue: "Port 4000 already in use"
**Solution:**
- Change `PORT=4000` to another port in `backend/.env`
- Or kill the process: `lsof -ti:4000 | xargs kill`

### Issue: "Prisma migration failed"
**Solution:**
- Check database connection
- Ensure database is empty or reset it
- Try: `npm run db:migrate reset` (WARNING: deletes all data)

## 📋 Quick Checklist

Before you can start developing:

- [ ] PostgreSQL database created and running
- [ ] `DATABASE_URL` set in `backend/.env`
- [ ] Clerk Secret Key added to `backend/.env`
- [ ] Clerk Publishable Key added to `web/.env.local`
- [ ] Database migrations run (`npm run db:migrate`)
- [ ] Backend server starts successfully
- [ ] Web server starts successfully
- [ ] Can access GraphQL Playground
- [ ] Can access web homepage

## 🎯 After Setup is Complete

Once everything is running:

1. **Explore the GraphQL API:**
   - Visit `http://localhost:4000/graphql`
   - Try different queries and mutations
   - Check the schema documentation

2. **Start Building Features:**
   - Read `FEATURES.md` for feature roadmap
   - Check `ARCHITECTURE.md` for system design
   - Begin implementing frontend components

3. **Set Up Development Workflow:**
   - Configure your IDE/editor
   - Set up Git (if not already done)
   - Consider setting up pre-commit hooks

## 📚 Helpful Commands Reference

```bash
# Backend
cd backend
npm run dev              # Start development server
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:studio       # Open Prisma Studio (database GUI)
npm run build           # Build for production

# Web
cd web
npm run dev             # Start Next.js dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
psql pravasi_jaalakam   # Connect to database
\dt                     # List all tables (in psql)
```

## 🆘 Need Help?

- Check `QUICKSTART.md` for detailed setup
- Review `CLERK_SETUP.md` for authentication setup
- See `ARCHITECTURE.md` for system overview
- Check backend logs for error messages
- Use Prisma Studio to inspect database

---

**Ready to start? Begin with Step 1 (PostgreSQL setup)!** 🚀

