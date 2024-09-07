import { z } from "zod";
import { SignInSchema, SignUpSchema } from "./utils/validation";

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn = z.infer<typeof SignInSchema>;

//Chats
export type GeneralChatInfo = {
  chatId: number;
  name: string;
  photo: string;
  lastMessage: string;
  lastMessageDate: string;
};

export type ChatMessage = {
  id: string;
  createdAt: Date;
  senderId: number;
  chatId: number;
  content: string;
  messageType: string;
};

export type User = {
  id: number;
  name: string;
  age: number;
  avatar: string | null;
  slug: string;
  email: string;
  phone: string | null;
  bio: string | null;
  joinedAt: Date;
};
