import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getServerAuthSession } from './get-server-auth-session';

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
