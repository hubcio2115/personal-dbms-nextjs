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
  email: z.string().email('Provided value is not in format of an email!'),
  phone: z.string().min(1, requiredErrorMessage),
  username: z.string().min(1, requiredErrorMessage),
  birthDate: z.date().max(new Date()),
  bloodGroup: z.custom<
    `${'A' | 'B' | 'O'}${'-' | '+'}` | 'O' | `AB${'-' | '+'}`
  >(
    (val) => /^([ABO]|AB)[+-]|O/g.test(val as string),
    'You provided non existent blood type!',
  ),
  height: z.number().min(0, negativeErrorMessage),
  weight: z.number().min(0, negativeErrorMessage),
  eyeColor: z.string().min(1, requiredErrorMessage),
});
export type PersonalDataSchema = z.infer<typeof personalDataSchema>;

export const personalDataSchemaWithoutId = personalDataSchema.omit({
  id: true,
});
export type PersonalDataWithoutId = z.infer<typeof personalDataSchemaWithoutId>;
