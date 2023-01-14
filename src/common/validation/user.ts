import { z } from 'zod';
import { personalDataSchema } from './personalData';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email('Email has a wrong format!'),
  password: z
    .string()
    .min(8, 'Password has to be at least 8 characters in length!')
    .refine(
      (data) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/g.test(
          data,
        ),
      'Password has to have one small character, uppercase character, number, special character!',
    ),
  role: z.enum(['ADMIN', 'USER']),
  personalData: personalDataSchema.optional(),
});
export type User = z.infer<typeof userSchema>;

export const userSchemaWithoutId = userSchema.omit({ id: true });
export type UserWithoutId = z.infer<typeof userSchemaWithoutId>;

export const registerUserSchema = userSchemaWithoutId
  .omit({ personalData: true, role: true })
  .extend({
    confirmPassword: z.string().min(1, 'This field is required!'),
    isPrivacyPolicyAccepted: z
      .boolean()
      .refine((value) => value, 'Please accept our privacy policy'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords are not the same!',
  });
export type RegisterUser = z.infer<typeof registerUserSchema>;

export const updateEmailSchema = z.object({
  id: z.string(),
  email: z.string().email('Email has a wrong format!'),
});
export type UpdateEmail = z.infer<typeof updateEmailSchema>;

export const updatePasswordSchema = z
  .object({
    id: z.string(),
    password: z
      .string()
      .min(8, 'Password has to be at least 8 characters in length!')
      .refine(
        (data) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/g.test(
            data,
          ),
        'Password has to have one small character, uppercase character, number, special character!',
      ),
    confirmPassword: z.string().min(1, 'This field is required!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords are not the same!',
  });
export type UpdatePassword = z.infer<typeof updatePasswordSchema>;
