import { GraphQLContext } from '../context';
import { requireAuth } from '../middleware/auth';

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, context: GraphQLContext) => {
      requireAuth(context);
      return context.user;
    },

    user: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { id },
        include: {
          authorProfile: true,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    },
  },

  Mutation: {
    updateProfile: async (
      _: any,
      args: {
        input: {
          name?: string;
          displayName?: string;
          bio?: string;
          avatar?: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const updated = await context.prisma.user.update({
        where: { id: context.user!.id },
        data: {
          ...(args.input.name !== undefined && { name: args.input.name }),
          ...(args.input.displayName !== undefined && {
            displayName: args.input.displayName,
          }),
          ...(args.input.bio !== undefined && { bio: args.input.bio }),
          ...(args.input.avatar !== undefined && { avatar: args.input.avatar }),
        },
      });

      return updated;
    },
  },
};
