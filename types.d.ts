import { z } from "zod";
import {
  SignInSchema,
  SignUpSchema,
  UpdateChatSchema,
} from "./lib/validations";

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn = z.infer<typeof SignInSchema>;
export type UpdateChat = z.infer<typeof UpdateChatSchema>;

export type DefaultApiResponse<T> = {
  data?: T;
  error?: any;
};

//Chats

export type Chat = {
  id: number;
  name: string;
  photo: string;
  isGroup: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

export type GeneralChatInfo = {
  chatId: number;
  name: string;
  photo: string;
  lastMessage: string | null;
  lastMessageDate: string | null;
};

export type LocalMessage = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  senderId: number;
  chatId: number;
  content: string | null;
  messageType: string;
  parentId: number | null;
  files: string[];
  isSystem: boolean;
  senderAvatar?: string;
  senderName?: string;
  parentMessage?: {
    id: number;
    content: string;
    sender: string;
  } | null;
};

export type ChatMessage = {
  id: number;
  createdAt: string;
  senderId: number;
  chatId?: number;
  content: string;
  messageType: string;
  senderAvatar: string;
  senderName: string;
  parentId: number | null;
  parentMessage?: {
    id: number;
    content: string;
    sender: string;
  };
  files: string[];
  isSystem: boolean;
  isPinned: boolean;
  pinnedAt: Date | null;
};

export type User = {
  id: number;
  name: string;
  age: number;
  avatar: string;
  slug: string;
  email: string;
  phone: string | null;
  bio: string | null;
  createdAt: Date;
  stripeCustomerId: string | null;
  isPremium: boolean;
};

export type ChatParticipant = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: ChatRole;
  isPremium: boolean;
};

export type ChatRole = "admin" | "moderator" | "user";
