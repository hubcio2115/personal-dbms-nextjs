import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const personalDataRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.personalData.findMany();
  }),

  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.personalData.findFirst({ where: { id: input } });
  }),
});
