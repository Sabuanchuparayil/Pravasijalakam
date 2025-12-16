import { GraphQLContext } from '../context';
import { requireAdmin } from '../middleware/auth';
import { GraphQLError } from 'graphql';

export const adminResolvers = {
  Query: {
    reports: async (
      _: any,
      args: { status?: string; limit?: number },
      context: GraphQLContext
    ) => {
      requireAdmin(context);

      const where: any = {};

      if (args.status) {
        where.status = args.status;
      }

      const reports = await context.prisma.report.findMany({
        where,
        include: {
          reportedBy: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: args.limit || 50,
      });

      return reports;
    },

    report: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAdmin(context);

      const report = await context.prisma.report.findUnique({
        where: { id },
        include: {
          reportedBy: true,
        },
      });

      if (!report) {
        throw new GraphQLError('Report not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return report;
    },
  },

  Mutation: {
    moderateContent: async (
      _: any,
      args: {
        id: string;
        action: string;
        notes?: string;
      },
      context: GraphQLContext
    ) => {
      requireAdmin(context);

      // This is a placeholder - actual implementation depends on target type
      // For now, we'll handle literature moderation
      const literature = await context.prisma.literature.findUnique({
        where: { id: args.id },
      });

      if (!literature) {
        throw new GraphQLError('Content not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      let status: string;
      switch (args.action) {
        case 'APPROVE':
          status = 'PUBLISHED';
          break;
        case 'REJECT':
          status = 'MODERATED';
          break;
        case 'ARCHIVE':
          status = 'ARCHIVED';
          break;
        case 'DELETE':
          await context.prisma.literature.delete({
            where: { id: args.id },
          });
          return true;
        default:
          throw new GraphQLError('Invalid action', {
            extensions: { code: 'BAD_REQUEST' },
          });
      }

      await context.prisma.literature.update({
        where: { id: args.id },
        data: {
          status: status as any,
        },
      });

      return true;
    },

    verifyAuthor: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAdmin(context);

      const author = await context.prisma.author.findUnique({
        where: { id },
      });

      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const updated = await context.prisma.author.update({
        where: { id },
        data: {
          isVerified: true,
        },
        include: {
          user: true,
        },
      });

      return updated;
    },
  },
};
