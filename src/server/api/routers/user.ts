import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter,
} from '~/server/api/trpc';
import { z } from 'zod';
import {
  registerUserSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from '~/common/validation/user';
import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';

export const userRouter = createTRPCRouter({
  createNewUser: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ ctx, input: { password, email } }) => {
      const isInDb = await ctx.prisma.user.findFirst({
        where: { email },
      });
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

  updateEmail: protectedProcedure
    .input(updateEmailSchema)
    .mutation(async ({ ctx, input: newUser }) => {
      const isAuthorized =
        ctx.session.user.role === 'ADMIN' ||
        ctx.session.user.id === newUser.id;

      if (isAuthorized) {
        const { id, email } = newUser;
        const isEmailTaken = await ctx.prisma.user.findFirst({
          where: { email },
        });

        if (!isEmailTaken)
          return ctx.prisma.user.update({
            where: { id },
            data: {
              email,
            },
          });

        throw new TRPCError({
          message: 'Provided email is taken!',
          code: 'CONFLICT',
        });
      }

      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }),

  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(async ({ ctx, input: newUser }) => {
      const isAuthorized =
        ctx.session.user.role === 'ADMIN' ||
        ctx.session.user.id === newUser.id;

      if (isAuthorized) {
        const { id, password } = newUser;

        return ctx.prisma.user.update({
          where: { id },
          data: { password: await hash(password) },
        });
      }

      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.id },
      });

      if (!!user) {
        if (
          ctx.session.user.role === 'ADMIN' ||
          user.id === ctx.session.user.id
        ) {
          await ctx.prisma.personalData.delete({
            where: { userId: input.id },
          });

          return ctx.prisma.user.delete({
            where: { id: input.id },
          });
        }

        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return null;
    }),
});
