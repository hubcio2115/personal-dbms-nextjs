import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import {
  personalDataSchema,
  personalDataSchemaWithoutId,
} from '~/common/validation/personalData';
import { TRPCError } from '@trpc/server';

export const personalDataRouter = createTRPCRouter({
  getFiltered: protectedProcedure
    .input(z.object({ searchParams: z.string() }))
    .query(({ ctx, input: { searchParams } }) =>
      ctx.session.user.role === 'ADMIN'
        ? ctx.prisma.personalData.findMany({
            where: { firstName: { contains: searchParams } },
          })
        : ctx.prisma.personalData.findMany({
            where: {
              AND: [
                {
                  OR: [{ isPrivate: false }, { userId: ctx.session.user.id }],
                },
                { firstName: { contains: searchParams } },
              ],
            },
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
          data.userId === ctx.session.user.id
        )
          return data;

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),

  byUserId: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.personalData.findFirst({
        where: { userId: ctx.session.user.id },
      }),
  ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.personalData.findFirst({
        where: { id: input.id },
      });

      if (!!data) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          data.userId === ctx.session.user.id
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
    .mutation(async ({ ctx, input: { id, ...data } }) => {
      const serverVersion = await ctx.prisma.personalData.findFirst({
        where: { id },
      });

      if (!!serverVersion) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          serverVersion.userId === ctx.session.user.id
        ) {
          return ctx.prisma.personalData.update({
            where: { id },
            data,
          });
        }

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),

  upsert: protectedProcedure
    .input(personalDataSchemaWithoutId)
    .mutation(async ({ ctx, input: data }) => {
      const foundData = await ctx.prisma.personalData.findFirst({
        where: { userId: data.userId },
      });

      if (!!foundData) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          foundData.userId === ctx.session.user.id
        )
          return ctx.prisma.personalData.update({
            where: { userId: data.userId },
            data: { ...data },
          });

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      } else {
        if (
          ctx.session.user.role === 'ADMIN' ||
          ctx.session.user.id === data.userId
        )
          return ctx.prisma.personalData.create({
            data: { ...data },
          });

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
    }),
});
