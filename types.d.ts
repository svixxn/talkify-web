import { z } from "zod";
import { SignInSchema, SignUpSchema } from "./utils/validation";

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn = z.infer<typeof SignInSchema>;

export type DefaultApiResponse<T> = {
  data?: T;
  error?: any;
};

//Chats
export type GeneralChatInfo = {
  chatId: number;
  name: string;
  photo: string;
  lastMessage: string | null;
  lastMessageDate: string | null;
};

export type ChatMessage = {
  id: string;
  createdAt: string;
  senderId: number;
  chatId?: number;
  content: string;
  messageType: string;
  senderAvatar: string;
};

//Users
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

export type ChatParticipant = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};
