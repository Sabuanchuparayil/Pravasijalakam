import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify';
import { buildSchema } from './schema';
import { createContext } from './context';
import { logger } from './utils/logger';
import { initializeClerk } from './utils/clerk';
import * as Sentry from '@sentry/node';

// Initialize Sentry if DSN is provided
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
}

// Initialize Clerk
initializeClerk();

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    // Create Fastify instance
    const fastify = Fastify({
      logger: process.env.NODE_ENV === 'development',
    });

    // Build GraphQL schema
    const schema = await buildSchema();

    // Create Apollo Server
    const apollo = new ApolloServer({
      schema,
      plugins: [fastifyApolloDrainPlugin(fastify)],
      introspection: process.env.NODE_ENV !== 'production',
    });

    // Register Apollo Server
    await apollo.start();
    const handler = fastifyApolloHandler(apollo, {
      context: async (request) => {
        return createContext({ request });
      },
    });
    await fastify.register(handler);

    // Health check endpoint
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Start server
    await fastify.listen({ port: PORT, host: HOST });
    logger.info(`🚀 GraphQL API server ready at http://${HOST}:${PORT}/graphql`);
  } catch (error) {
    logger.error('Failed to start server:', error);
    if (error instanceof Error) {
      logger.error('Error details:', error.message);
      logger.error('Stack:', error.stack);
    }
    Sentry.captureException(error);
    process.exit(1);
  }
}

startServer();

