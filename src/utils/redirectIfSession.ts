import type { GetServerSidePropsContext } from 'next';
import { type Session } from 'next-auth';

export const redirectIfSession = (
  session: Session | null,
  isAuthenticated: boolean,
  destination: string,
  ctx: GetServerSidePropsContext,
) => {
  const isSession = isAuthenticated ? !!session : !session;

  return isSession
    ? {
        redirect: {
          destination,
          permanent: false,
        },
      }
    : {
        props: {
          session,
          query: ctx.query,
        },
      };
};
