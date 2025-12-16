# Contributing to Pravasi Jaalakam

Thank you for your interest in contributing to Pravasi Jaalakam!

## Development Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   cd ../web && npm install
   cd ../mobile && flutter pub get
   ```

3. **Set up environment variables:**
   - Copy `.env.example` files to `.env` in each directory
   - Configure required services (Clerk, Cloudinary, etc.)

4. **Set up database:**
   ```bash
   cd backend
   npm run db:migrate
   ```

5. **Start development servers:**
   ```bash
   # Backend
   cd backend && npm run dev

   # Web
   cd web && npm run dev
   ```

## Code Standards

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful comments
- Keep functions focused and small

### Flutter/Dart
- Follow Flutter style guide
- Use `flutter analyze` before committing
- Write tests for critical features
- Use Riverpod for state management

### GraphQL
- Schema-first approach
- Document all types and fields
- Use descriptive names
- Handle errors gracefully

### Database
- Use Prisma migrations
- Index frequently queried fields
- Use transactions for multi-step operations
- Validate data at the database level

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

Example: `feat(literature): add search functionality`

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit PR with clear description

## Testing

- Write tests for new features
- Ensure all tests pass
- Test on multiple devices/browsers (for mobile/web)

## Questions?

Open an issue or reach out to the maintainers.

