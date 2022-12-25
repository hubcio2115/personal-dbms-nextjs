import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import {
  userSchema,
  userSchemaWithoutId,
} from '../../../common/validation/user';
import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';

export const userRouter = router({
  createNewUser: publicProcedure
    .input(userSchemaWithoutId.omit({ role: true }))
    .mutation(async ({ ctx, input: { password, email } }) => {
      const passwd = await hash(password);
      return ctx.prisma.user.create({
        data: { role: 'USER', email, password: passwd },
      });
    }),

  updateUser: protectedProcedure
    .input(userSchema)
    .query(({ ctx, input: newUser }) => {
      if (
        ctx.session?.user.userId === newUser.id ||
        ctx.session.user.role === 'ADMIN'
      ) {
        const { id, ...user } = newUser;
        return ctx.prisma.user.update({ where: { id }, data: user });
      }

      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }),

  deleteUser: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: userId }) =>
      ctx.prisma.user.delete({ where: { id: userId } }),
    ),
});
