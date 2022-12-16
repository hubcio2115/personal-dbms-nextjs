import { router } from '../trpc';
import { authRouter } from './auth';
import { personalDataRouter } from './personalData';

export const appRouter = router({
  personalData: personalDataRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
