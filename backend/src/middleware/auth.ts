import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

/**
 * Requires authentication - throws error if user is not authenticated
 */
export function requireAuth(context: GraphQLContext): void {
  if (!context.isAuthenticated || !context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

/**
 * Requires author role - throws error if user is not an author or admin
 */
export function requireAuthor(context: GraphQLContext): void {
  requireAuth(context);
  if (!context.isAuthor && !context.isAdmin) {
    throw new GraphQLError('Author role required', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}

/**
 * Requires admin role - throws error if user is not an admin
 */
export function requireAdmin(context: GraphQLContext): void {
  requireAuth(context);
  if (!context.isAdmin) {
    throw new GraphQLError('Admin role required', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}

