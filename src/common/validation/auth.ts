import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email form!'),
  password: z.string().min(8, 'Provided password is too short!'),
});

export type Login = z.infer<typeof loginSchema>;
