import { z } from 'zod';

const REQUIRED_ERROR_MESSAGE = 'This field cannot be empty!';
const NEGATIVE_ERROR_MESSAGE = 'This value has to be positive!';

export const personalDataSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, REQUIRED_ERROR_MESSAGE),
  lastName: z.string().min(1, REQUIRED_ERROR_MESSAGE),
  maidenName: z.string().nullable(),
  age: z.number().min(0, NEGATIVE_ERROR_MESSAGE),
  sex: z.enum(['female', 'male']),
  phone: z.string().min(1, REQUIRED_ERROR_MESSAGE),
  isPrivate: z.boolean(),
  userId: z.string(),
});
export type PersonalDataSchema = z.infer<typeof personalDataSchema>;

export const personalDataSchemaWithoutId = personalDataSchema.omit({
  id: true,
});
export type PersonalDataWithoutId = z.infer<typeof personalDataSchemaWithoutId>;
