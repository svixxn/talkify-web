import { useMutation, useQuery } from "react-query";
import {
  getChatInfo,
  getUserChats,
  loginUser,
  registerUser,
  searchUsers,
} from "./functions";
import { GeneralChatInfo, SignIn, SignUp } from "@/types";

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
