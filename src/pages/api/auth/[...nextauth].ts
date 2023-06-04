import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { prisma } from '~/server/db';
import { loginSchema } from '~/common/validation/auth';
import { verify } from 'argon2';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    jwt: ({ token, user }) => {
      if (!!user) {
        token.userId = user.id;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (!!token) {
        session.user.userId = token.userId;
        session.user.email = token.email;
        session.user.role = token.role;
      }

      return session;
    },
  },
  jwt: {
    maxAge: 1 * 24 * 30 * 60,
  },
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'email',
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
          where: { email: creds.email },
        });

        if (!user) return null;

        const isValidPassword = await verify(user.password, creds.password);

        if (!isValidPassword) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
