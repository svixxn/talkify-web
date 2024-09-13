import { useMutation, useQuery } from "react-query";
import {
  createChat,
  getChatInfo,
  getUserChats,
  loginUser,
  registerUser,
  searchUsers,
} from "./functions";
import { GeneralChatInfo, SignIn, SignUp } from "@/types";
import { CreateChat } from "@/lib/validations";

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: Omit<SignUp, "confirmPassword">) => registerUser(data),
  });
};

export const useFetchUserChats = (userId: number) => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getUserChats,
  });
};

export const useFetchChatInfo = (chatId: number) => {
  return useQuery({
    queryKey: ["chatInfo", chatId],
    queryFn: () => getChatInfo(chatId),
  });
};

export const useSearchUsers = (searchValue: string) => {
  return useQuery({
    queryKey: ["searchUsers", searchValue],
    queryFn: () => searchUsers(searchValue),
  });
};

export const useCreateChat = () => {
  return useMutation({
    mutationKey: ["createChat"],
    mutationFn: (data: CreateChat) => createChat(data),
  });
};
