import { GraphQLContext } from '../context';
import { requireAuth } from '../middleware/auth';
import { GraphQLError } from 'graphql';

export const commentResolvers = {
  Mutation: {
    createComment: async (
      _: any,
      args: {
        input: {
          content: string;
          literatureId?: string;
          parentCommentId?: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      if (!args.input.literatureId && !args.input.parentCommentId) {
        throw new GraphQLError('Either literatureId or parentCommentId is required', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      // If parent comment, verify it exists and get literatureId from it
      let literatureId = args.input.literatureId;
      if (args.input.parentCommentId) {
        const parent = await context.prisma.comment.findUnique({
          where: { id: args.input.parentCommentId },
        });

        if (!parent) {
          throw new GraphQLError('Parent comment not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        literatureId = parent.literatureId || undefined;
      }

      // Verify literature exists if provided
      if (literatureId) {
        const literature = await context.prisma.literature.findUnique({
          where: { id: literatureId },
        });

        if (!literature) {
          throw new GraphQLError('Literature not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
      }

      const comment = await context.prisma.comment.create({
        data: {
          content: args.input.content,
          authorId: context.user!.id,
          literatureId: literatureId || null,
          parentCommentId: args.input.parentCommentId || null,
        },
        include: {
          author: true,
          parentComment: true,
          replies: true,
        },
      });

      return comment;
    },

    updateComment: async (
      _: any,
      args: {
        id: string;
        content: string;
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await context.prisma.comment.findUnique({
        where: { id: args.id },
      });

      if (!existing) {
        throw new GraphQLError('Comment not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership
      if (existing.authorId !== context.user!.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const updated = await context.prisma.comment.update({
        where: { id: args.id },
        data: {
          content: args.content,
          isEdited: true,
        },
        include: {
          author: true,
          parentComment: true,
          replies: true,
        },
      });

      return updated;
    },

    deleteComment: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await context.prisma.comment.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new GraphQLError('Comment not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      if (existing.authorId !== context.user!.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await context.prisma.comment.delete({
        where: { id },
      });

      return true;
    },
  },
};

