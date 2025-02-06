import { GeneralChatInfo } from "@/types";
import { QueryClient } from "react-query";

type LocalMessage = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  senderId: number;
  chatId: number;
  content: string;
  messageType: string;
  senderAvatar: string;
  senderName: string;
  parentId: number | null;
  parentMessage?: {
    id: number;
    content: string;
    sender: string;
  } | null;
  files: string[];
};

export function updateMessagesStatusOnNewMessage(
  queryClient: QueryClient,
  chatId: number,
  message: LocalMessage
) {
  queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
    return {
      data: [...(oldData?.data || []), message],
    };
  });

  queryClient.setQueryData(["chats", { searchValue: "" }], (oldData: any) => {
    const chatIndex = oldData.data.findIndex(
      (chat: GeneralChatInfo) => chat.chatId === chatId
    );

    if (chatIndex > -1) {
      const updatedChat = {
        ...oldData.data[chatIndex],
        lastMessage: message.content,
        lastMessageDate: message.createdAt,
      };

      return {
        data: [
          updatedChat,
          ...oldData.data.slice(0, chatIndex),
          ...oldData.data.slice(chatIndex + 1),
        ],
      };
    }

    return oldData;
  });
}

export function updateMessagesStatusOnDeleteMessage(
  queryClient: QueryClient,
  chatId: number,
  messageId: number
) {
  let previousMessageInfo: { lastMessage: string; lastMessageDate: Date };

  queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
    const messageIndex = oldData.data.findIndex(
      (message: any) => message.id === messageId
    );

    const newData = oldData.data.filter(
      (message: any) => message.id !== messageId
    );

    if (newData.length > 0) {
      previousMessageInfo = {
        lastMessage: oldData.data[messageIndex - 1].content,
        lastMessageDate: oldData.data[messageIndex - 1].createdAt,
      };
    }

    return {
      data: newData,
    };
  });

  queryClient.setQueryData(["chats", { searchValue: "" }], (oldData: any) => {
    const chatIndex = oldData.data.findIndex(
      (chat: GeneralChatInfo) => chat.chatId === chatId
    );

    if (chatIndex > -1) {
      oldData.data[chatIndex] = {
        ...oldData.data[chatIndex],
        lastMessage: previousMessageInfo.lastMessage,
        lastMessageDate: previousMessageInfo.lastMessageDate,
      };

      const newChats = oldData.data.sort(
        (a: GeneralChatInfo, b: GeneralChatInfo) => {
          if (!a.lastMessageDate) return -1;
          if (!b.lastMessageDate) return 1;
          return (
            new Date(b.lastMessageDate).getTime() -
            new Date(a.lastMessageDate).getTime()
          );
        }
      );

      return {
        data: newChats,
      };
    }

    return oldData;
  });
}
