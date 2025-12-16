import { GraphQLContext } from '../context';
import { requireAuth, requireAuthor } from '../middleware/auth';
import { GraphQLError } from 'graphql';

export const authorResolvers = {
  Query: {
    author: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      const author = await context.prisma.author.findUnique({
        where: { id },
        include: {
          user: true,
          works: {
            where: {
              status: 'PUBLISHED',
            },
            orderBy: {
              publishedAt: 'desc',
            },
          },
        },
      });

      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return author;
    },

    authors: async (
      _: any,
      args: { verified?: boolean; limit?: number },
      context: GraphQLContext
    ) => {
      const where: any = {};

      if (args.verified !== undefined) {
        where.isVerified = args.verified;
      }

      const authors = await context.prisma.author.findMany({
        where,
        include: {
          user: true,
        },
        take: args.limit || 20,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return authors;
    },
  },

  Mutation: {
    createAuthorProfile: async (
      _: any,
      args: {
        input: {
          penName?: string;
          bio?: string;
          bioEn?: string;
          avatar?: string;
          socialLinks?: any;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Check if author profile already exists
      const existing = await context.prisma.author.findUnique({
        where: { userId: context.user!.id },
      });

      if (existing) {
        throw new GraphQLError('Author profile already exists', {
          extensions: { code: 'ALREADY_EXISTS' },
        });
      }

      const author = await context.prisma.author.create({
        data: {
          userId: context.user!.id,
          penName: args.input.penName,
          bio: args.input.bio,
          bioEn: args.input.bioEn,
          avatar: args.input.avatar,
          socialLinks: args.input.socialLinks,
        },
        include: {
          user: true,
        },
      });

      // Update user role to AUTHOR
      await context.prisma.user.update({
        where: { id: context.user!.id },
        data: {
          role: 'AUTHOR',
        },
      });

      return author;
    },

    updateAuthorProfile: async (
      _: any,
      args: {
        input: {
          penName?: string;
          bio?: string;
          bioEn?: string;
          avatar?: string;
          socialLinks?: any;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuthor(context);

      const author = await context.prisma.author.findUnique({
        where: { userId: context.user!.id },
      });

      if (!author) {
        throw new GraphQLError('Author profile not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const updated = await context.prisma.author.update({
        where: { id: author.id },
        data: {
          ...(args.input.penName !== undefined && { penName: args.input.penName }),
          ...(args.input.bio !== undefined && { bio: args.input.bio }),
          ...(args.input.bioEn !== undefined && { bioEn: args.input.bioEn }),
          ...(args.input.avatar !== undefined && { avatar: args.input.avatar }),
          ...(args.input.socialLinks !== undefined && {
            socialLinks: args.input.socialLinks,
          }),
        },
        include: {
          user: true,
        },
      });

      return updated;
    },
  },
};
