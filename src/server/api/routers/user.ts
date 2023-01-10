import { publicProcedure, protectedProcedure, createTRPCRouter } from '../trpc';
import { z } from 'zod';
import {
  registerUserSchema,
  userSchema,
} from '../../../common/validation/user';
import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';

export const userRouter = createTRPCRouter({
  createNewUser: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ ctx, input: { password, email } }) => {
      const isInDb = await ctx.prisma.user.findFirst({ where: { email } });
      const passwd = await hash(password);

      if (isInDb === null)
        return ctx.prisma.user.create({
          data: { role: 'USER', email, password: passwd },
        });

      throw new TRPCError({
        message: 'Provided email is taken!',
        code: 'CONFLICT',
      });
    }),

  updateUser: protectedProcedure
    .input(userSchema)
    .query(({ ctx, input: newUser }) => {
      if (
        ctx.session.user.role === 'ADMIN' ||
        ctx.session.user.userId === newUser.id
      ) {
        const { id, ...user } = newUser;
        return ctx.prisma.user.update({ where: { id }, data: user });
      }

      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.id },
      });

      if (!!user) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          user.id === ctx.session.user.userId
        )
          return ctx.prisma.user.delete({
            where: { id: input.id },
          });

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),
});