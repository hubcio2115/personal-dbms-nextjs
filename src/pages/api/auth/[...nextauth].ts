import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verify } from 'argon2';

import { prisma } from '../../../server/db/client';
import { loginSchema } from '../../../server/common/auth';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      if (!!token) {
        session.user.userId = token.userId;
        session.user.username = token.username;
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      if (!!user) {
        token.userId = user.id;
        token.username = user.username;
      }

      return token;
    },
  },
  jwt: {
    maxAge: 1 * 24 * 30 * 60,
  },
  pages: {
    signIn: '/admin',
  },
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: {
          label: 'username',
          type: 'text',
          placeholder: 'username',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password',
        },
      },
      authorize: async (credentials) => {
        const creds = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { username: creds.username },
        });

        if (!user) return null;

        const isValidPassword = await verify(user.password, creds.password);

        if (!isValidPassword) return null;

        return {
          id: user.id,
          username: user.username,
        };
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
