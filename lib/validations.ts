import { z } from "zod";

export const CreateChatSchema = z
  .object({
    users: z
      .array(z.number())
      .min(1, "Please select at least one user to create chat with"),
    name: z.string().default(""),
  })
  .refine(
    (s) => {
      if (s.users.length > 1 && !s.name) return false;
      else return true;
    },
    { message: "Please provide a chat name", path: ["name"] }
  )
  .refine(
    (s) => {
      if (s.name && s.users.length < 2) return false;
      else return true;
    },
    {
      message: "Please select at least two users to create group chat",
      path: ["users"],
    }
  );

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

export const UpdateChatSchema = z.object({
  name: z.string().min(4).max(52).optional(),
  description: z.string().optional(),
});

export const InviteUsersToChatSchema = z.object({
  users: z.array(z.number()).min(1),
});

export const UpdateUserSChema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  avatar: z.string().optional().nullable(),
});

export const UpdateChatMemberSchema = z.object({
  role: z.enum(["admin", "moderator", "user"]).optional(),
});

export type InviteUsersToChat = z.infer<typeof InviteUsersToChatSchema>;
export type CreateChat = z.infer<typeof CreateChatSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSChema>;
export type UpdateChatMember = z.infer<typeof UpdateChatMemberSchema>;
