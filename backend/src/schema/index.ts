import { readFileSync } from 'fs';
import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import { authResolvers } from '../resolvers/auth';
import { literatureResolvers } from '../resolvers/literature';
import { authorResolvers } from '../resolvers/author';
import { communityResolvers } from '../resolvers/community';
import { adminResolvers } from '../resolvers/admin';
import { commentResolvers } from '../resolvers/comments';

/**
 * Builds the complete GraphQL schema from schema.graphql and all resolvers
 */
export async function buildSchema() {
  // Load type definitions from schema.graphql
  const typeDefs = readFileSync(
    join(__dirname, 'schema.graphql'),
    'utf-8'
  );

  // Merge all resolvers
  const resolvers = mergeResolvers([
    authResolvers,
    literatureResolvers,
    authorResolvers,
    communityResolvers,
    adminResolvers,
    commentResolvers,
  ]);

  // Create executable schema
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}

