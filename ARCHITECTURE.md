# Pravasi Jaalakam Architecture

## Overview

Pravasi Jaalakam follows an **API-first architecture** with clear separation between backend services, web frontend, and mobile application.

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Web (Next.js) │     │ Mobile (Flutter)│
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌────────▼────────┐
            │  GraphQL API    │
            │  (Backend)      │
            └────────┬────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
    │PostgreSQL│ │ Redis  │ │Cloudinary│
    └─────────┘ └────────┘ └─────────┘
```

## Backend Architecture

### GraphQL API Server

- **Framework:** Apollo Server with Fastify
- **Schema:** Schema-first approach (`.graphql` files)
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** Clerk.dev
- **Caching:** Redis (optional)

### Core Modules

1. **Auth & Identity**
   - User management
   - Role-based access control (RBAC)
   - Session handling

2. **Literature**
   - Content publishing
   - Reading experience
   - Search & discovery

3. **Author Management**
   - Author profiles
   - Verification system
   - Recognition features

4. **Community**
   - Classifieds
   - Events
   - Discussions

5. **Moderation**
   - Content reporting
   - Admin tools
   - Trust mechanisms

## Web Application

### Next.js 14 (App Router)

- **Framework:** Next.js 14 with App Router
- **SSR/ISR:** Server-side rendering and incremental static regeneration
- **i18n:** Malayalam-first, English secondary
- **State:** Apollo Client for GraphQL
- **Styling:** Tailwind CSS

### Key Features

- SEO-optimized pages
- Server-side rendering for performance
- Progressive Web App (PWA) capabilities
- Responsive design (mobile-first)

## Mobile Application

### Flutter

- **Framework:** Flutter 3.0+
- **State Management:** Riverpod
- **Architecture:** Feature-based clean architecture
- **GraphQL:** graphql_flutter
- **Offline:** Hive for local storage

### Key Features

- Native performance
- Offline reading support
- Push notifications (OneSignal)
- Malayalam font support

## Database Schema

### Core Entities

- **User:** Authentication, profiles, roles
- **Author:** Extended author profiles, verification
- **Literature:** Stories, poems, articles
- **Comment:** Threaded comments on literature
- **Classified:** Community classifieds
- **Event:** Community events
- **Report:** Moderation reports

### Relationships

- User → Author (one-to-one)
- Author → Literature (one-to-many)
- Literature → Comments (one-to-many)
- User → Comments (one-to-many)
- User → Classifieds (one-to-many)
- User → Events (many-to-many via EventAttendee)

## Authentication & Authorization

### Roles

- **GUEST:** Unauthenticated users (read-only)
- **MEMBER:** Authenticated users (can comment, like)
- **AUTHOR:** Verified authors (can publish)
- **ADMIN:** Platform administrators (full access)

### RBAC Implementation

- GraphQL schema-level permissions
- Resolver-level authorization checks
- Database-level constraints

## Deployment

### Railway Platform

- **Backend:** Railway service (Node.js)
- **Web:** Railway service (Next.js)
- **Database:** Railway managed PostgreSQL
- **Redis:** Railway plugin (if needed)
- **Environment:** Separate configs for dev/staging/prod

### CI/CD

- Automatic builds on Git push
- Environment-based deployments
- Health checks and monitoring

## Observability

- **Error Tracking:** Sentry
- **Analytics:** Plausible or Mixpanel
- **Logging:** Structured logging (Pino)
- **Monitoring:** Railway built-in monitoring

## Security

- **Authentication:** Clerk.dev (JWT tokens)
- **Authorization:** Role-based at GraphQL level
- **Data Validation:** Zod schemas
- **Input Sanitization:** Server-side validation
- **CORS:** Configured for web/mobile origins

## Performance

- **Caching:** Redis for frequently accessed data
- **CDN:** Cloudinary for media assets
- **Search:** Typesense for full-text search
- **Database:** Indexed queries, connection pooling

## Internationalization

- **Primary:** Malayalam (മലയാളം)
- **Secondary:** English
- **Implementation:** i18n libraries with proper RTL support
- **Fonts:** Noto Sans Malayalam

## Future Considerations

- Real-time features (GraphQL subscriptions)
- Advanced search with Typesense
- Push notifications (OneSignal)
- Analytics integration
- Content recommendation engine

