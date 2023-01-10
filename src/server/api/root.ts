import { createTRPCRouter } from './trpc';
import { personalDataRouter } from './routers/personalData';
import { userRouter } from './routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  personalData: personalDataRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
