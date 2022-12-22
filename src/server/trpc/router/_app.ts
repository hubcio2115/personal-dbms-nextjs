import { router } from '../trpc';
import { personalDataRouter } from './personalData';

export const appRouter = router({
  personalData: personalDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
