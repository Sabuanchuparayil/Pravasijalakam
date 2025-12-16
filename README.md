# Pravasi Jaalakam

> A cultural, literary, and community-driven digital platform for the Malayalam-speaking expatriate community

## 🎯 Product Vision

Pravasi Jaalakam connects, preserves, and celebrates Malayalam language, literature, and expatriate life. The platform is designed to be:

- **Emotional and culturally rooted**
- **Trustworthy and safe**
- **Mobile-first**
- **Malayalam-first** (English secondary)

## 🏗️ Architecture Overview

This is a monorepo containing:

```
pravasi-jaalakam/
├── backend/          # GraphQL API server
├── web/             # Next.js 14 web application
├── mobile/          # Flutter mobile application
├── shared/          # Shared types, schemas, utilities
└── admin/           # Admin dashboard (Next.js)
```

### Tech Stack

**Backend:**
- GraphQL (Apollo Server / GraphQL Yoga)
- PostgreSQL (Railway managed)
- Redis (Railway plugin, if needed)
- Clerk.dev or Supabase Auth
- Cloudinary (media storage)
- Typesense (search)
- Sentry (error tracking)

**Web:**
- Next.js 14 (App Router, SSR/ISR)
- TypeScript
- Tailwind CSS
- i18n (Malayalam primary, English secondary)

**Mobile:**
- Flutter (iOS & Android)
- Riverpod (state management)
- GraphQL client
- Offline support

**Infrastructure:**
- Railway (deployment platform)
- Managed PostgreSQL
- Environment-based configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Flutter SDK 3.0+
- PostgreSQL (local for development, Railway for production)
- Railway CLI (for deployment)

### Development Setup

1. **Clone and install dependencies:**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install web dependencies
cd ../web && npm install

# Install mobile dependencies
cd ../mobile && flutter pub get
```

2. **Environment Configuration:**

Copy `.env.example` files in each directory and configure:
- Database connection strings
- Auth provider credentials
- Cloudinary keys
- Sentry DSN
- Other service API keys

3. **Database Setup:**

```bash
cd backend
npm run db:migrate
npm run db:seed  # Optional: seed development data
```

4. **Start Development Servers:**

```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Web App
cd web
npm run dev

# Terminal 3: Mobile (optional, for hot reload)
cd mobile
flutter run
```

## 📁 Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── schema/           # GraphQL schema definitions
│   ├── resolvers/        # GraphQL resolvers
│   ├── services/         # Business logic
│   ├── models/           # Database models (Prisma/TypeORM)
│   ├── middleware/       # Auth, logging, error handling
│   └── utils/            # Utilities and helpers
├── prisma/               # Database schema and migrations
└── tests/                # Backend tests
```

### Web (`/web`)

```
web/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Auth routes
│   ├── (literature)/    # Literature routes
│   ├── (community)/     # Community features
│   └── api/             # API routes (if needed)
├── components/          # React components
├── lib/                 # Utilities, GraphQL client
├── public/              # Static assets
└── styles/              # Global styles
```

### Mobile (`/mobile`)

```
mobile/
├── lib/
│   ├── features/        # Feature-based modules
│   ├── core/            # Core utilities, models
│   ├── services/        # API services, GraphQL client
│   └── widgets/         # Reusable widgets
├── assets/              # Images, fonts, translations
└── test/                # Mobile tests
```

## 🔐 Authentication & Authorization

- **Authentication:** Clerk.dev or Supabase Auth
- **Roles:** Guest, Member, Author, Admin
- **RBAC:** Role-based access control implemented at GraphQL level

## 🌐 Internationalization

- **Primary Language:** Malayalam (മലയാളം)
- **Secondary Language:** English
- **Implementation:** i18n libraries with proper RTL support where needed

## 📦 Deployment

### Railway Deployment

1. **Connect Repository:**
   - Link GitHub repository to Railway
   - Configure build and start commands

2. **Services:**
   - Backend API service
   - Web application service
   - PostgreSQL database (managed)
   - Redis (if needed)

3. **Environment Variables:**
   - Configure via Railway dashboard
   - Separate environments: development, staging, production

### Build Commands

**Backend:**
```bash
npm run build
npm start
```

**Web:**
```bash
npm run build
npm start
```

**Mobile:**
- iOS: Build via Xcode or CI/CD
- Android: Build via Gradle or CI/CD

## 🧪 Testing

- Backend: Jest/Vitest
- Web: Jest + React Testing Library
- Mobile: Flutter Test

## 📊 Observability

- **Error Tracking:** Sentry
- **Analytics:** Plausible or Mixpanel
- **Logging:** Structured logging compatible with Railway

## 🤝 Contributing

This is a production application. All code should:
- Be clean, readable, and commented
- Follow TypeScript/Flutter best practices
- Include appropriate error handling
- Be tested where critical

## 📄 License

[To be determined]

---

**Built with ❤️ for the Malayalam expatriate community**

