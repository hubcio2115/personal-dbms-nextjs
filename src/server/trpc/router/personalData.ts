import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import {
  personalDataSchema,
  personalDataSchemaWithoutId,
} from '../../../common/validation/personalData';
import { TRPCError } from '@trpc/server';

export const personalDataRouter = router({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.session.user.role === 'ADMIN'
      ? ctx.prisma.personalData.findMany()
      : ctx.prisma.personalData.findMany({
          where: { OR: { isPrivate: false, userId: ctx.session?.user.userId } },
        }),
  ),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.personalData.findFirst({
        where: { id: input.id },
      });

      if (!!data) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          !data.isPrivate ||
          data.userId === ctx.session.user.userId
        )
          return data;

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.personalData.findFirst({
        where: { id: input.id },
      });

      if (!!data) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          data.userId === ctx.session.user.userId
        )
          return ctx.prisma.personalData.delete({
            where: { id: input.id },
          });

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),

  update: protectedProcedure
    .input(personalDataSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.personalData.findFirst({
        where: { id: input.id },
      });

      if (!!data) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          data.userId === ctx.session.user.userId
        ) {
          const { id: personalId, ...newData } = data;

          return ctx.prisma.personalData.update({
            where: {
              id: input.id,
            },
            data: newData,
          });
        }

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),

  create: protectedProcedure
    .input(
      personalDataSchemaWithoutId.extend({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: data }) => {
      const foundUser = await ctx.prisma.user.findFirst({
        where: { id: data.userId },
      });

      if (!!foundUser) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          foundUser.id === ctx.session.user.userId
        )
          return ctx.prisma.personalData.create({
            data,
          });

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),
});
