import { GraphQLContext } from '../context';
import { requireAuth } from '../middleware/auth';
import { GraphQLError } from 'graphql';

export const communityResolvers = {
  Query: {
    classifieds: async (
      _: any,
      args: {
        category?: string;
        location?: string;
        limit?: number;
        offset?: number;
      },
      context: GraphQLContext
    ) => {
      const where: any = {
        status: 'ACTIVE',
      };

      if (args.category) {
        where.category = args.category;
      }

      if (args.location) {
        where.location = {
          contains: args.location,
          mode: 'insensitive',
        };
      }

      const classifieds = await context.prisma.classified.findMany({
        where,
        include: {
          postedBy: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: args.limit || 20,
        skip: args.offset || 0,
      });

      return classifieds;
    },

    classified: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      const classified = await context.prisma.classified.findUnique({
        where: { id },
        include: {
          postedBy: true,
        },
      });

      if (!classified) {
        throw new GraphQLError('Classified not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return classified;
    },

    events: async (
      _: any,
      args: { upcoming?: boolean; limit?: number },
      context: GraphQLContext
    ) => {
      const where: any = {
        isPublic: true,
      };

      if (args.upcoming) {
        where.startDate = {
          gte: new Date(),
        };
      }

      const events = await context.prisma.event.findMany({
        where,
        include: {
          organizer: true,
          attendees: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
        take: args.limit || 20,
      });

      return events;
    },

    event: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      const event = await context.prisma.event.findUnique({
        where: { id },
        include: {
          organizer: true,
          attendees: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!event) {
        throw new GraphQLError('Event not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return event;
    },
  },

  Mutation: {
    createClassified: async (
      _: any,
      args: {
        input: {
          title: string;
          description: string;
          category: string;
          location?: string;
          contactInfo?: any;
          images?: string[];
          expiresAt?: Date;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const classified = await context.prisma.classified.create({
        data: {
          title: args.input.title,
          description: args.input.description,
          category: args.input.category as any,
          location: args.input.location,
          contactInfo: args.input.contactInfo,
          images: args.input.images || [],
          expiresAt: args.input.expiresAt,
          postedById: context.user!.id,
        },
        include: {
          postedBy: true,
        },
      });

      return classified;
    },

    updateClassified: async (
      _: any,
      args: {
        id: string;
        input: {
          title?: string;
          description?: string;
          category?: string;
          location?: string;
          contactInfo?: any;
          images?: string[];
          status?: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await context.prisma.classified.findUnique({
        where: { id: args.id },
      });

      if (!existing) {
        throw new GraphQLError('Classified not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      if (existing.postedById !== context.user!.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const updated = await context.prisma.classified.update({
        where: { id: args.id },
        data: {
          ...(args.input.title && { title: args.input.title }),
          ...(args.input.description && { description: args.input.description }),
          ...(args.input.category && { category: args.input.category as any }),
          ...(args.input.location !== undefined && { location: args.input.location }),
          ...(args.input.contactInfo !== undefined && {
            contactInfo: args.input.contactInfo,
          }),
          ...(args.input.images && { images: args.input.images }),
          ...(args.input.status && { status: args.input.status as any }),
        },
        include: {
          postedBy: true,
        },
      });

      return updated;
    },

    deleteClassified: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await context.prisma.classified.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new GraphQLError('Classified not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      if (existing.postedById !== context.user!.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await context.prisma.classified.delete({
        where: { id },
      });

      return true;
    },

    createEvent: async (
      _: any,
      args: {
        input: {
          title: string;
          titleEn?: string;
          description: string;
          descriptionEn?: string;
          location: string;
          startDate: Date;
          endDate?: Date;
          image?: string;
          isPublic?: boolean;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const event = await context.prisma.event.create({
        data: {
          title: args.input.title,
          titleEn: args.input.titleEn,
          description: args.input.description,
          descriptionEn: args.input.descriptionEn,
          location: args.input.location,
          startDate: args.input.startDate,
          endDate: args.input.endDate,
          image: args.input.image,
          isPublic: args.input.isPublic ?? true,
          organizerId: context.user!.id,
        },
        include: {
          organizer: true,
        },
      });

      return event;
    },

    updateEvent: async (
      _: any,
      args: {
        id: string;
        input: {
          title?: string;
          titleEn?: string;
          description?: string;
          descriptionEn?: string;
          location?: string;
          startDate?: Date;
          endDate?: Date;
          image?: string;
          isPublic?: boolean;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await context.prisma.event.findUnique({
        where: { id: args.id },
      });

      if (!existing) {
        throw new GraphQLError('Event not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      if (existing.organizerId !== context.user!.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const updated = await context.prisma.event.update({
        where: { id: args.id },
        data: {
          ...(args.input.title && { title: args.input.title }),
          ...(args.input.titleEn !== undefined && { titleEn: args.input.titleEn }),
          ...(args.input.description && { description: args.input.description }),
          ...(args.input.descriptionEn !== undefined && {
            descriptionEn: args.input.descriptionEn,
          }),
          ...(args.input.location && { location: args.input.location }),
          ...(args.input.startDate && { startDate: args.input.startDate }),
          ...(args.input.endDate !== undefined && { endDate: args.input.endDate }),
          ...(args.input.image !== undefined && { image: args.input.image }),
          ...(args.input.isPublic !== undefined && { isPublic: args.input.isPublic }),
        },
        include: {
          organizer: true,
        },
      });

      return updated;
    },

    deleteEvent: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await context.prisma.event.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new GraphQLError('Event not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check ownership or admin
      if (existing.organizerId !== context.user!.id && !context.isAdmin) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await context.prisma.event.delete({
        where: { id },
      });

      return true;
    },

    attendEvent: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const event = await context.prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        throw new GraphQLError('Event not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check if already attending
      const existing = await context.prisma.eventAttendee.findUnique({
        where: {
          eventId_userId: {
            eventId: id,
            userId: context.user!.id,
          },
        },
      });

      if (existing) {
        // Already attending, return event as-is
        return event;
      }

      // Add attendee
      await context.prisma.eventAttendee.create({
        data: {
          eventId: id,
          userId: context.user!.id,
        },
      });

      const updated = await context.prisma.event.findUnique({
        where: { id },
        include: {
          organizer: true,
          attendees: {
            include: {
              user: true,
            },
          },
        },
      });

      return updated!;
    },

    reportContent: async (
      _: any,
      args: {
        input: {
          type: string;
          targetType: string;
          targetId: string;
          reason: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const report = await context.prisma.report.create({
        data: {
          type: args.input.type as any,
          targetType: args.input.targetType as any,
          targetId: args.input.targetId,
          reason: args.input.reason,
          reportedById: context.user!.id,
          status: 'PENDING',
        },
        include: {
          reportedBy: true,
        },
      });

      return report;
    },
  },
};
