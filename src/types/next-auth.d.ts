import type { DefaultUser } from 'next-auth';

type Role = 'ADMIN' | 'USER';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      userId: string;
      email: string;
      role: Role;
    };
  }

  interface User extends Omit<DefaultUser, 'name' | 'image'> {
    role: Role;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    email: string;
    role: Role;
  }
}
