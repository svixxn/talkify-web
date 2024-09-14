import { z } from "zod";

export const CreateChatSchema = z
  .object({
    users: z.array(z.number(), { message: "Please select at least one user" }),
    name: z.string().optional(),
  })
  .refine(
    (s) => {
      if (s.users.length > 1 && !s.name) return false;
      else return true;
    },
    { message: "Please provide a chat name", path: ["name"] }
  );

export type CreateChat = z.infer<typeof CreateChatSchema>;

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
