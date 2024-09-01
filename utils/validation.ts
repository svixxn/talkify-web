import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3),
    age: z.string().min(1, "Age cannot be empty").or(z.number()),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
