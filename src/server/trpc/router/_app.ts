import { router } from '../trpc';
import { personalDataRouter } from './personalData';
import { userRouter } from './user';

export const appRouter = router({
  personalData: personalDataRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
