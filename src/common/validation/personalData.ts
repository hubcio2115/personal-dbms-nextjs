import { z } from 'zod';

const requiredErrorMessage = 'This field cannot be empty!';
const negativeErrorMessage = 'This value has to be positive!';

export const personalDataSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, requiredErrorMessage),
  lastName: z.string().min(1, requiredErrorMessage),
  maidenName: z.string().min(1, requiredErrorMessage),
  age: z.number().min(0, negativeErrorMessage),
  sex: z.enum(['female', 'male']),
  phone: z.string().min(1, requiredErrorMessage),
  isPrivate: z.boolean(),
  userId: z.string().optional(),
});
export type PersonalDataSchema = z.infer<typeof personalDataSchema>;

export const personalDataSchemaWithoutId = personalDataSchema.omit({
  id: true,
});
export type PersonalDataWithoutId = z.infer<typeof personalDataSchemaWithoutId>;
