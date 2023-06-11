import { type GetServerSidePropsContext } from 'next';
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth';
import { env } from '~/env.mjs';
import KeycloakProvider from 'next-auth/providers/keycloak';

type UserRole = 'ADMIN' | 'USER';
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
    // provider: string;
  }

  interface Profile {
    realm_access: {
      roles: string[];
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    id_token: string;
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // Include user.id on session
  session: {
    strategy: 'jwt',
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user, account, profile }) {
      if (!!account && !!account.id_token) {
        token.id_token = account.id_token;
      }

      if (!!user) {
        token.id = user.id;
        token.email = user.email;
      }

      if (!!profile) {
        token.role = profile.realm_access.roles.includes('admin')
          ? 'ADMIN'
          : 'USER';
      }

      return token;
    },
    session({ token, session }) {
      session.user.id = token.id;
      session.user.role = token.role;

      return session;
    },
  },
  jwt: {
    maxAge: 1 * 24 * 30 * 60,
  },
  events: {
    async signOut({ token }) {
      try {
        const endSessionURL = `${env.KC_ISSUER}/protocol/openid-connect/logout`;
        const params = new URLSearchParams();
        params.append('id_token_hint', token.id_token);

        await fetch(`${endSessionURL}?${params.toString()}`);
      } catch (e) {
        console.error('Unable to perform post-logout handshake', e);
      }
    },
  },
  providers: [
    KeycloakProvider({
      clientId: env.KC_ID,
      clientSecret: env.KC_SECRET,
      issuer: env.KC_ISSUER,
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export function getServerAuthSession(ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) {
  return getServerSession(ctx.req, ctx.res, authOptions);
}
