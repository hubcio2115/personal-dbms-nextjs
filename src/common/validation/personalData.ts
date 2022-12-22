import { z } from 'zod';

export const personalDataSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  maidenName: z.string().min(1),
  age: z.number().min(0),
  sex: z.enum(['female', 'male']),
  email: z.string().email(),
  phone: z.string().min(1),
  username: z.string().min(1),
  birthDate: z.date(),
  bloodGroup: z.custom<`${'A' | 'B' | 'O'}${'-' | '+'}`>((val) =>
    /^[ABO][+-]/g.test(val as string),
  ),
  height: z.number().min(0),
  weight: z.number().min(0),
  eyeColor: z.string().min(1),
});
export type PersonalDataSchema = z.infer<typeof personalDataSchema>;

export const personalDataSchemaWithoutId = personalDataSchema.omit({
  id: true,
});
export type PersonalDataWithoutId = z.infer<typeof personalDataSchemaWithoutId>;
