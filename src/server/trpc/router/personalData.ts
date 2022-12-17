import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import {
  basePersonalDataSchema,
  personalDataSchemaWithId,
} from '../../../types/personal-data';

export const personalDataRouter = router({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.prisma.personalData.findMany(),
  ),

  byId: publicProcedure
    .input(z.string())
    .query(({ ctx, input: id }) =>
      ctx.prisma.personalData.findFirst({ where: { id } }),
    ),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ ctx, input: id }) =>
      ctx.prisma.personalData.delete({ where: { id } }),
    ),

  update: publicProcedure
    .input(personalDataSchemaWithId)
    .mutation(({ ctx, input: data }) =>
      ctx.prisma.personalData.update({
        where: { id: data.id },
        data,
      }),
    ),

  create: publicProcedure
    .input(basePersonalDataSchema)
    .mutation(({ ctx, input: data }) =>
      ctx.prisma.personalData.create({ data }),
    ),
});
