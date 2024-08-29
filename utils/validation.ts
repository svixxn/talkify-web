import { z } from "zod";

export const SignUpShema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3),
    age: z.number().min(16),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((schema) => {
    //TODO: add password checking
  });
