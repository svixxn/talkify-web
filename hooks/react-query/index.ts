import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  clearChatHistory,
  createChat,
  createStripeCheckoutSession,
  deleteChat,
  deleteChatMessage,
  getChatInfo,
  getChatMessages,
  getUserById,
  getUserChats,
  inviteUsersToChat,
  leaveChat,
  loginUser,
  pinMessage,
  registerUser,
  removeUsersFromChat,
  searchUsers,
  searchUsersToCreateChat,
  sendChatMessage,
  updateChat,
  updateChatMember,
  updateUser,
} from "./functions";
import { SignUp } from "@/types";
import { CreateChat, UpdateChatMember, UpdateUser } from "@/lib/validations";
import { updateMessagesStatusOnNewMessage } from "@/lib/websocket/chats";
import { Socket } from "socket.io-client";

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
    refetchOnWindowFocus: false,
  });
};

export const useSearchUsers = (searchValue: string, filtered?: number[]) => {
  return useQuery({
    queryKey: ["searchUsers", searchValue],
    queryFn: () => searchUsers(searchValue, filtered),
  });
};

export const useGetUserById = (userId: number) => {
  return useQuery({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useSearchUsersToCreateChat = () => {
  return useQuery({
    queryKey: ["searchUsersToCreateChat"],
    queryFn: () => searchUsersToCreateChat(),
  });
};

export const useLeaveChat = (chatId: number, socket: Socket | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["leaveChat"],
    mutationFn: () => leaveChat(chatId),
    onSuccess: (data) => {
      queryClient.invalidateQueries("chats");
      updateMessagesStatusOnNewMessage(
        queryClient,
        chatId,
        data.data?.systemMessage!
      );
      socket?.emit("chat-message", JSON.stringify(data.data?.systemMessage!));
    },
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

export const useClearChatHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["clearChatHistory"],
    mutationFn: (chatId: number) => clearChatHistory({ chatId }),
    onSuccess: (data, chatId) => {
      queryClient.setQueryData(["chatMessages", chatId], () => {
        return {
          data: {
            messages: [],
            pinnedMessage: null,
          },
        };
      });
      queryClient.invalidateQueries("chats");
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: (data: {
      id: number;
      content: string;
      messageType: string;
      chatId: number;
      parentId: number | null;
      files: string[];
    }) => sendChatMessage(data),
  });
};

export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateChat"],
    mutationFn: (data: {
      name?: string;
      description?: string;
      chatId: number;
      image: string | null;
    }) => updateChat(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries("chats");
      queryClient.invalidateQueries(["chatInfo", data.data?.updatedChat.id]);
    },
  });
};

export const useDeleteChatMessage = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteChatMessage"],
    mutationFn: (data: { chatId: number; messageId: number }) =>
      deleteChatMessage(data),
    // onSuccess: (res, data) => {
    //   queryClient.setQueryData(
    //     ["chatMessages", data.chatId],
    //     (prevData: any) => {
    //       const newData = prevData.data.filter(
    //         (message: any) => message.id !== data.messageId
    //       );
    //       return {
    //         data: newData,
    //       };
    //     }
    //   );
    //   queryClient.invalidateQueries("chats");
    // },
  });
};

export const usePinMessage = (chatId: number, socket: Socket | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["pinMessage"],
    mutationFn: (data: { messageId: number; chatId: number }) =>
      pinMessage(data),
    onSuccess: (data) => {
      if (!data.data?.systemMessage) return;

      updateMessagesStatusOnNewMessage(
        queryClient,
        chatId,
        data.data?.systemMessage
      );
      socket?.emit("chat-message", JSON.stringify(data.data?.systemMessage!));
    },
  });
};

export const useInviteUsersToChat = (chatId: number, socket: Socket | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["inviteUsersToChat"],
    mutationFn: (data: { users: number[]; chatId: number }) =>
      inviteUsersToChat(data),
    onSuccess: (data) => {
      if (data.error) return;
      queryClient.invalidateQueries(["chatInfo", chatId]);
      updateMessagesStatusOnNewMessage(
        queryClient,
        chatId,
        data.data?.systemMessage!
      );
      socket?.emit("chat-message", JSON.stringify(data.data?.systemMessage!));
    },
  });
};

export const useRemoveUsersFromChat = (
  chatId: number,
  socket: Socket | null
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["removeUsersToChat"],
    mutationFn: (data: { users: number[]; chatId: number }) =>
      removeUsersFromChat(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["chatInfo", chatId]);
      updateMessagesStatusOnNewMessage(
        queryClient,
        chatId,
        data.data?.systemMessage!
      );
      socket?.emit("chat-message", JSON.stringify(data.data?.systemMessage!));
    },
  });
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateUser", userId],
    mutationFn: (data: { userId: number; data: UpdateUser }) =>
      updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["getUserById", userId]);
    },
  });
};

export const useUpdateChatMember = (memberId: number, chatId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateChatMember", memberId, chatId],
    mutationFn: (data: {
      memberId: number;
      chatId: number;
      data: UpdateChatMember;
    }) => updateChatMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["chatInfo", chatId]);
    },
  });
};

export const useCreateStripeCheckoutSession = () => {
  return useMutation({
    mutationKey: ["createStripeCheckoutSession"],
    mutationFn: () => createStripeCheckoutSession(),
  });
};
