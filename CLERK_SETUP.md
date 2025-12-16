# Clerk Authentication Setup

## Your Clerk Instance

Based on the information provided, your Clerk instance is configured at:
- **Accounts URL:** `https://legible-quetzal-32.clerk.accounts.dev`
- **API URL:** `https://api.clerk.com`
- **JWKS Endpoint:** `https://legible-quetzal-32.clerk.accounts.dev/.well-known/jwks.json`

## Required Credentials

To complete the setup, you need to get these from your [Clerk Dashboard](https://dashboard.clerk.com):

### 1. Secret Key (Backend)
- Go to: **API Keys** → **Secret Keys**
- Copy the key that starts with `sk_test_` (development) or `sk_live_` (production)
- This is used in `backend/.env` as `CLERK_SECRET_KEY`

### 2. Publishable Key (Frontend)
- Go to: **API Keys** → **Publishable Keys**
- Copy the key that starts with `pk_test_` (development) or `pk_live_` (production)
- This is used in `web/.env.local` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Configuration Steps

### Backend Configuration

1. **Update `backend/.env`:**
   ```env
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

2. **The backend will automatically:**
   - Verify JWT tokens from Clerk
   - Sync Clerk users to your database
   - Create user records on first authentication

### Web Configuration

1. **Update `web/.env.local`:**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

2. **Update `web/app/layout.tsx`** (if needed):
   ```tsx
   import { ClerkProvider } from '@clerk/nextjs';
   
   export default function RootLayout({ children }) {
     return (
       <ClerkProvider>
         {children}
       </ClerkProvider>
     );
   }
   ```

## How It Works

1. **User Authentication Flow:**
   - User signs in via Clerk (web/mobile)
   - Clerk issues a JWT token
   - Frontend sends token in `Authorization: Bearer <token>` header
   - Backend verifies token with Clerk
   - Backend syncs user to database (if new)
   - User is authenticated in GraphQL context

2. **User Sync:**
   - When a user authenticates for the first time, the backend automatically:
     - Fetches user details from Clerk
     - Creates a corresponding record in your PostgreSQL database
     - Links the Clerk user ID to your database user

3. **Token Verification:**
   - The backend uses Clerk's SDK to verify JWT tokens
   - Tokens are validated against your Clerk instance
   - Invalid/expired tokens are rejected

## Testing Authentication

### 1. Test Backend Authentication

```bash
# Start backend
cd backend && npm run dev

# In another terminal, test with a valid token
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
  -d '{"query": "{ me { id email name } }"}'
```

### 2. Test Web Integration

1. Sign up/login via Clerk in your web app
2. Clerk will provide a session token
3. The token is automatically sent with GraphQL requests
4. Check browser DevTools → Network to see the Authorization header

## Important Notes

1. **Secret Key Security:**
   - Never commit `.env` files to Git
   - Use different keys for development and production
   - Rotate keys if compromised

2. **Clerk SDK Deprecation:**
   - `@clerk/clerk-sdk-node` is deprecated (EOL: Jan 10, 2025)
   - Consider migrating to `@clerk/express` or direct JWT verification
   - Current implementation works but should be updated

3. **Environment Variables:**
   - Backend needs: `CLERK_SECRET_KEY`
   - Web needs: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

## Troubleshooting

### "Invalid token" errors
- Verify `CLERK_SECRET_KEY` is correct
- Check token hasn't expired
- Ensure token is from the correct Clerk instance

### "User not found" errors
- User sync happens automatically on first auth
- Check database connection
- Verify Prisma migrations have run

### CORS errors
- Add your frontend URL to Clerk's allowed origins
- Check `CORS_ORIGIN` in backend `.env`

## Next Steps

1. Get your Clerk API keys from the dashboard
2. Update `.env` files with actual keys
3. Test authentication flow
4. Consider setting up webhooks for user events (optional)

---

**Reference:** [Clerk Documentation](https://clerk.com/docs)

