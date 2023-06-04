import {
  type GetServerSidePropsResult,
  type GetServerSidePropsContext,
} from 'next';
import { type Session } from 'next-auth';
import { type ParsedUrlQuery } from 'querystring';

export function redirectIfSession(
  session: Session | null,
  isAuthenticated: boolean,
  destination: string,
  ctx: GetServerSidePropsContext,
): GetServerSidePropsResult<{ session: Session | null, query: ParsedUrlQuery }> {
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
}
