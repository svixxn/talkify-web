import { z } from "zod";

export const CreateChatSchema = z.object({
  users: z.array(z.number(), { message: "Please select at least one user" }),
  name: z.string().optional(),
});
//   .refine(
//     (s) => {
//       if (s.users.length > 1 && !s.name) return false;
//     },
//     { message: "Please provide a chat name" }
//   );

export type CreateChat = z.infer<typeof CreateChatSchema>;
