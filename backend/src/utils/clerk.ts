import { clerkClient } from '@clerk/clerk-sdk-node';
import { logger } from './logger';

/**
 * Initialize Clerk client with secret key
 * This ensures Clerk SDK is properly configured
 */
export function initializeClerk() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  if (!secretKey) {
    logger.warn('CLERK_SECRET_KEY not set - authentication will not work');
    return;
  }

  // Clerk client is initialized automatically via environment variable
  // But we can verify it's set
  if (secretKey.startsWith('sk_')) {
    logger.info('Clerk authentication initialized');
  } else {
    logger.warn('CLERK_SECRET_KEY format appears invalid (should start with sk_)');
  }
}

/**
 * Get Clerk user by ID
 */
export async function getClerkUser(clerkUserId: string) {
  try {
    const user = await clerkClient.users.getUser(clerkUserId);
    return user;
  } catch (error) {
    logger.error(`Error fetching Clerk user ${clerkUserId}:`, error);
    throw error;
  }
}

/**
 * Verify Clerk JWT token
 */
export async function verifyClerkToken(token: string) {
  try {
    const decoded = await clerkClient.verifyToken(token);
    return decoded;
  } catch (error) {
    logger.debug('Clerk token verification failed:', error);
    throw error;
  }
}

