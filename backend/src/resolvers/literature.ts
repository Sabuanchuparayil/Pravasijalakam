import { GraphQLContext } from '../context';
import { requireAuth, requireAuthor } from '../middleware/auth';
import { GraphQLError } from 'graphql';

export const literatureResolvers = {
  Query: {
    literature: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      const literature = await context.prisma.literature.findUnique({
        where: { id },
        include: {
          author: {
            include: {
              user: true,
            },
          },
          commentThreads: {
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!literature) {
        throw new GraphQLError('Literature not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return literature;
    },

    literatures: async (
      _: any,
      args: {
        type?: string;
        language?: string;
        authorId?: string;
        tags?: string[];
        featured?: boolean;
        limit?: number;
        offset?: number;
      },
      context: GraphQLContext
    ) => {
      const where: any = {
        status: 'PUBLISHED',
      };

      if (args.type) {
        where.type = args.type;
      }

      if (args.language) {
        where.language = args.language;
      }

      if (args.authorId) {
        where.authorId = args.authorId;
      }

      if (args.featured !== undefined) {
        where.isFeatured = args.featured;
      }

      if (args.tags && args.tags.length > 0) {
        where.tags = {
          hasSome: args.tags,
        };
      }

      const literatures = await context.prisma.literature.findMany({
        where,
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: args.limit || 20,
        skip: args.offset || 0,
      });

      return literatures;
    },

    searchLiterature: async (
      _: any,
      { query, limit = 20 }: { query: string; limit?: number },
      context: GraphQLContext
    ) => {
      // Basic search - in production, use Typesense
      const literatures = await context.prisma.literature.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
      });

      return literatures;
    },
  },

  Mutation: {
    createLiterature: async (
      _: any,
      args: {
        input: {
          title: string;
          titleEn?: string;
          content: string;
          type: string;
          language: string;
          tags: string[];
          coverImage?: string;
          excerpt?: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuthor(context);

      // Get or create author profile
      let author = await context.prisma.author.findUnique({
        where: { userId: context.user!.id },
      });

      if (!author) {
        author = await context.prisma.author.create({
          data: {
            userId: context.user!.id,
          },
        });
      }

      const literature = await context.prisma.literature.create({
        data: {
          title: args.input.title,
          titleEn: args.input.titleEn,
          content: args.input.content,
          excerpt: args.input.excerpt,
          type: args.input.type as any,
          language: args.input.language as any,
          tags: args.input.tags,
          coverImage: args.input.coverImage,
          authorId: author.id,
          status: 'DRAFT',
        },
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
      });

      return literature;
    },

    updateLiterature: async (
      _: any,
      args: {
        id: string;
        input: {
          title?: string;
          titleEn?: string;
          content?: string;
          tags?: string[];
          coverImage?: string;
          excerpt?: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuthor(context);

      const existing = await context.prisma.literature.findUnique({
        where: { id: args.id },
      });

      if (!existing) {
        throw new GraphQLError('Literature not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      const author = await context.prisma.author.findUnique({
        where: { userId: context.user!.id },
      });

      if (existing.authorId !== author?.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const updated = await context.prisma.literature.update({
        where: { id: args.id },
        data: {
          ...(args.input.title && { title: args.input.title }),
          ...(args.input.titleEn !== undefined && { titleEn: args.input.titleEn }),
          ...(args.input.content && { content: args.input.content }),
          ...(args.input.excerpt !== undefined && { excerpt: args.input.excerpt }),
          ...(args.input.tags && { tags: args.input.tags }),
          ...(args.input.coverImage !== undefined && { coverImage: args.input.coverImage }),
        },
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
      });

      return updated;
    },

    publishLiterature: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuthor(context);

      const existing = await context.prisma.literature.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new GraphQLError('Literature not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      const author = await context.prisma.author.findUnique({
        where: { userId: context.user!.id },
      });

      if (existing.authorId !== author?.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const published = await context.prisma.literature.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
      });

      return published;
    },

    deleteLiterature: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuthor(context);

      const existing = await context.prisma.literature.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new GraphQLError('Literature not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      const author = await context.prisma.author.findUnique({
        where: { userId: context.user!.id },
      });

      if (existing.authorId !== author?.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await context.prisma.literature.delete({
        where: { id },
      });

      return true;
    },

    likeLiterature: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const literature = await context.prisma.literature.findUnique({
        where: { id },
      });

      if (!literature) {
        throw new GraphQLError('Literature not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check if already liked
      const existingLike = await context.prisma.literatureLike.findUnique({
        where: {
          userId_literatureId: {
            userId: context.user!.id,
            literatureId: id,
          },
        },
      });

      if (existingLike) {
        // Already liked, return literature as-is
        return literature;
      }

      // Create like and increment count
      await context.prisma.$transaction([
        context.prisma.literatureLike.create({
          data: {
            userId: context.user!.id,
            literatureId: id,
          },
        }),
        context.prisma.literature.update({
          where: { id },
          data: {
            likes: {
              increment: 1,
            },
          },
        }),
      ]);

      const updated = await context.prisma.literature.findUnique({
        where: { id },
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
      });

      return updated!;
    },

    unlikeLiterature: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const literature = await context.prisma.literature.findUnique({
        where: { id },
      });

      if (!literature) {
        throw new GraphQLError('Literature not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check if liked
      const existingLike = await context.prisma.literatureLike.findUnique({
        where: {
          userId_literatureId: {
            userId: context.user!.id,
            literatureId: id,
          },
        },
      });

      if (!existingLike) {
        // Not liked, return literature as-is
        return literature;
      }

      // Delete like and decrement count
      await context.prisma.$transaction([
        context.prisma.literatureLike.delete({
          where: {
            userId_literatureId: {
              userId: context.user!.id,
              literatureId: id,
            },
          },
        }),
        context.prisma.literature.update({
          where: { id },
          data: {
            likes: {
              decrement: 1,
            },
          },
        }),
      ]);

      const updated = await context.prisma.literature.findUnique({
        where: { id },
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
      });

      return updated!;
    },
  },
};
