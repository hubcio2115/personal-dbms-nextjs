import { z } from 'zod';

export const basePersonalDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string(),
  age: z.number(),
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
  birthDate: z.string(),
  bloodGroup: z.string(),
  height: z.number(),
  weight: z.number(),
  eyeColor: z.string(),
});

export const personalDataSchemaWithId = basePersonalDataSchema.merge(
  z.object({
    id: z.string(),
  }),
);
