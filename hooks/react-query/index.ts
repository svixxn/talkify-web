import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createChat,
  deleteChat,
  getChatInfo,
  getChatMessages,
  getUserChats,
  loginUser,
  registerUser,
  searchUsers,
  searchUsersToCreateChat,
  sendChatMessage,
} from "./functions";
import { GeneralChatInfo, SignIn, SignUp } from "@/types";
import { CreateChat } from "@/lib/validations";

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: Omit<SignUp, "confirmPassword">) => registerUser(data),
  });
};

export const useFetchUserChats = (searchValue: string) => {
  return useQuery({
    queryKey: ["chats", { searchValue }],
    queryFn: () => getUserChats(searchValue),
  });
};

export const useFetchChatInfo = (chatId: number) => {
  return useQuery({
    queryKey: ["chatInfo", chatId],
    queryFn: () => getChatInfo(chatId),
  });
};

export const useFetchChatMessages = (chatId: number) => {
  return useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: () => getChatMessages(chatId),
  });
};

export const useSearchUsers = (searchValue: string) => {
  return useQuery({
    queryKey: ["searchUsers", searchValue],
    queryFn: () => searchUsers(searchValue),
  });
};

export const useSearchUsersToCreateChat = () => {
  return useQuery({
    queryKey: ["searchUsersToCreateChat"],
    queryFn: () => searchUsersToCreateChat(),
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createChat"],
    mutationFn: (data: CreateChat) => createChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries("chats");
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteChat"],
    mutationFn: (chatId: number) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries("chats");
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: (data: {
      content: string;
      messageType: string;
      chatId: number;
    }) => sendChatMessage(data),
  });
};
