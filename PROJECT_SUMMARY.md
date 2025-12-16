# Pravasi Jaalakam - Project Summary

## 🎯 Project Overview

Pravasi Jaalakam is a production-grade web and mobile application for the Malayalam-speaking expatriate community, primarily in the Middle East. It's a cultural, literary, and community-driven digital platform designed to connect, preserve, and celebrate Malayalam language, literature, and expatriate life.

## 📁 Project Structure

```
pravasi-jaalakam/
├── backend/          # GraphQL API server (Node.js, Apollo Server, Prisma)
├── web/             # Next.js 14 web application
├── mobile/          # Flutter mobile application (iOS & Android)
├── shared/          # Shared types, schemas, utilities
├── README.md        # Main project documentation
├── ARCHITECTURE.md  # System architecture details
├── DEPLOYMENT.md    # Railway deployment guide
├── FEATURES.md      # Feature roadmap (V1 and beyond)
├── QUICKSTART.md    # Quick start guide
└── CONTRIBUTING.md  # Contribution guidelines
```

## 🏗️ Architecture

### Backend (GraphQL API)
- **Framework:** Apollo Server with Fastify
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** Clerk.dev
- **Schema:** Schema-first approach (`.graphql` files)
- **Modules:**
  - Auth & Identity
  - Literature (stories, poems, articles)
  - Author Management
  - Community (classifieds, events)
  - Comments & Engagement
  - Moderation & Reporting

### Web Application
- **Framework:** Next.js 14 (App Router)
- **Features:** SSR/ISR, SEO-optimized
- **Styling:** Tailwind CSS
- **i18n:** Malayalam-first, English secondary
- **State:** Apollo Client for GraphQL

### Mobile Application
- **Framework:** Flutter 3.0+
- **State Management:** Riverpod
- **Architecture:** Feature-based clean architecture
- **Features:** Offline support, push notifications

## 🔑 Key Features (V1 MVP)

### ✅ Implemented Foundation
- [x] Monorepo structure
- [x] GraphQL schema and resolvers
- [x] Database schema (Prisma)
- [x] Authentication middleware
- [x] Role-based access control (RBAC)
- [x] Literature CRUD operations
- [x] Author profiles
- [x] Comments system
- [x] Community features (classifieds, events)
- [x] Moderation system
- [x] Admin resolvers

### 🚧 Ready for Implementation
- [ ] Frontend components (Next.js)
- [ ] Mobile app screens (Flutter)
- [ ] Clerk authentication integration
- [ ] Cloudinary media upload
- [ ] Typesense search integration
- [ ] OneSignal push notifications
- [ ] Sentry error tracking
- [ ] i18n implementation

## 🛠️ Tech Stack

### Backend
- Node.js 18+
- TypeScript
- Apollo Server 4
- Fastify
- Prisma ORM
- PostgreSQL
- Clerk.dev (Auth)
- Cloudinary (Media)
- Typesense (Search)
- Redis (Caching, optional)
- Sentry (Error Tracking)

### Web
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Apollo Client
- next-intl (i18n)

### Mobile
- Flutter 3.0+
- Dart
- Riverpod
- GraphQL Client
- Hive (Offline storage)
- OneSignal

### Infrastructure
- Railway (Deployment)
- PostgreSQL (Managed)
- Redis (Optional)

## 📊 Database Schema

### Core Entities
- **User** - Authentication, profiles, roles
- **Author** - Extended author profiles, verification
- **Literature** - Stories, poems, articles, essays
- **Comment** - Threaded comments on literature
- **LiteratureLike** - User likes on literature
- **Classified** - Community classifieds
- **Event** - Community events
- **EventAttendee** - Event RSVPs
- **Report** - Content moderation reports

### Relationships
- User ↔ Author (1:1)
- Author → Literature (1:many)
- Literature → Comments (1:many)
- User → Comments (1:many)
- User → Classifieds (1:many)
- User → Events (many:many)

## 🔐 Authentication & Authorization

### Roles
- **GUEST** - Unauthenticated (read-only)
- **MEMBER** - Authenticated users (comment, like)
- **AUTHOR** - Verified authors (publish literature)
- **ADMIN** - Platform administrators (full access)

### Implementation
- Clerk.dev for authentication
- JWT tokens
- GraphQL context-based authorization
- Middleware functions for role checks

## 🌐 Internationalization

- **Primary:** Malayalam (മലയാളം)
- **Secondary:** English
- **Font:** Noto Sans Malayalam
- **Implementation:** next-intl (web), Flutter i18n (mobile)

## 🚀 Deployment

### Railway Platform
- Backend API service
- Web application service
- PostgreSQL database (managed)
- Redis (optional)
- Environment-based configuration

### CI/CD
- Automatic deployments on Git push
- Environment separation (dev/staging/prod)

## 📈 Observability

- **Error Tracking:** Sentry
- **Analytics:** Plausible or Mixpanel
- **Logging:** Pino (structured logging)
- **Monitoring:** Railway built-in

## 🎯 Next Steps

1. **Complete Backend:**
   - Implement remaining resolvers
   - Add input validation (Zod)
   - Set up Typesense integration
   - Add rate limiting

2. **Build Web Frontend:**
   - Create Next.js pages and components
   - Implement GraphQL queries/mutations
   - Add Malayalam i18n
   - Build admin dashboard

3. **Develop Mobile App:**
   - Create Flutter screens
   - Implement GraphQL client
   - Add offline support
   - Integrate push notifications

4. **Integrate Services:**
   - Clerk authentication
   - Cloudinary media upload
   - Typesense search
   - OneSignal notifications
   - Sentry error tracking

5. **Testing & QA:**
   - Unit tests
   - Integration tests
   - E2E tests
   - Performance testing

6. **Deploy to Production:**
   - Set up Railway services
   - Configure environment variables
   - Run database migrations
   - Monitor and optimize

## 📚 Documentation

- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [FEATURES.md](./FEATURES.md) - Feature roadmap
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

## 🤝 Development Philosophy

- **Production-grade:** Not a demo or prototype
- **Scalable:** Designed for growth
- **Maintainable:** Clean, documented code
- **Cultural:** Malayalam-first, emotionally resonant
- **Trustworthy:** Moderation and safety features
- **Mobile-first:** Responsive and native mobile experience

---

**Status:** Foundation Complete ✅  
**Next Phase:** Frontend Development & Service Integration

