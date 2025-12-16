import { FastifyRequest } from 'fastify';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { logger } from './utils/logger';

export interface GraphQLContext {
  request: FastifyRequest;
  userId?: string;
  user?: any; // User from database
  prisma: PrismaClient;
  redis?: Redis;
  isAuthenticated: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
}

/**
 * Syncs Clerk user to database if not exists
 */
async function syncClerkUserToDatabase(
  prisma: PrismaClient,
  clerkUserId: string
): Promise<any> {
  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (user) {
      return user;
    }

    // Fetch user details from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    // Create user in database
    user = await prisma.user.create({
      data: {
        clerkId: clerkUserId,
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
        name: clerkUser.firstName || null,
        displayName: clerkUser.username || clerkUser.firstName || null,
        avatar: clerkUser.imageUrl || null,
        role: 'MEMBER',
        isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
      },
    });

    logger.info(`Created new user in database: ${user.id} (Clerk: ${clerkUserId})`);
    return user;
  } catch (error) {
    logger.error('Error syncing Clerk user to database:', error);
    throw error;
  }
}

/**
 * Creates the GraphQL context for each request
 */
export async function createContext({
  request,
}: {
  request: FastifyRequest;
}): Promise<GraphQLContext> {
  const prisma = new PrismaClient();
  let redis: Redis | undefined;
  
  // Initialize Redis if URL is provided
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
  }

  // Extract auth token from request
  const authHeader = request.headers.authorization;
  let userId: string | undefined;
  let user: any = null;
  let isAuthenticated = false;
  let isAuthor = false;
  let isAdmin = false;

  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      
      // Verify token with Clerk
      const clerkSecretKey = process.env.CLERK_SECRET_KEY;
      if (clerkSecretKey) {
        // Verify the JWT token with Clerk
        const decoded = await clerkClient.verifyToken(token);
        userId = decoded.sub;
        
        if (userId) {
          // Sync user to database if needed, or fetch existing
          try {
            user = await syncClerkUserToDatabase(prisma, userId);
            isAuthenticated = !!user;
            isAuthor = user?.role === 'AUTHOR' || user?.role === 'ADMIN';
            isAdmin = user?.role === 'ADMIN';
          } catch (syncError) {
            logger.error('Error syncing user:', syncError);
            // User remains unauthenticated if sync fails
          }
        }
      }
    } catch (error) {
      // Token verification failed - user remains unauthenticated
      logger.debug('Token verification failed:', error);
    }
  }

  return {
    request,
    userId,
    user,
    prisma,
    redis,
    isAuthenticated,
    isAuthor,
    isAdmin,
  };
}

