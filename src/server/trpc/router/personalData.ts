import { router, publicProcedure } from '../trpc';

export const personalDataRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.personalData.findMany();
  }),
});
