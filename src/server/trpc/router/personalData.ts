import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import {
  personalDataSchema,
  personalDataSchemaWithoutId,
} from '../../../common/validation/personalData';

export const personalDataRouter = router({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.prisma.personalData.findMany(),
  ),

  byId: publicProcedure
    .input(z.string())
    .query(({ ctx, input: id }) =>
      ctx.prisma.personalData.findFirst({ where: { id } }),
    ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: id }) =>
      ctx.prisma.personalData.delete({ where: { id } }),
    ),

  update: protectedProcedure
    .input(personalDataSchema)
    .mutation(({ ctx, input: data }) => {
      const { id, ...inputData } = data;
      return ctx.prisma.personalData.update({
        where: { id },
        data: inputData,
      });
    }),

  create: protectedProcedure
    .input(personalDataSchemaWithoutId)
    .mutation(({ ctx, input: data }) =>
      ctx.prisma.personalData.create({ data }),
    ),
});
