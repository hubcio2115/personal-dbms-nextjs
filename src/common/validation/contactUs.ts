import { z } from 'zod';

export const contactUsSchema = z.object({
  email: z.string().email('Provided email format is wrong!'),
  title: z.string().min(1, 'Title cannot be empty!'),
  mailMessage: z.string().min(1, 'Message cannot be empty!'),
});
export type ContactUs = z.infer<typeof contactUsSchema>;
