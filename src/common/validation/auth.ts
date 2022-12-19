import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(4).max(20),
});

export type Login = z.infer<typeof loginSchema>;
