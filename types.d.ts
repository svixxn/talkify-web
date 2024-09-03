import { z } from "zod";
import { SignInSchema, SignUpSchema } from "./utils/validation";

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn = z.infer<typeof SignInSchema>;
export type GeneralChatInfo = {
  chatId: number;
  name: string;
  photo: string;
  lastMessage: string;
};
