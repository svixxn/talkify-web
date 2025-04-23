import { GeneralChatInfo, LocalMessage } from "@/types";
import { QueryClient } from "react-query";

export function updateMessagesStatusOnNewMessage(
  queryClient: QueryClient,
  chatId: number,
  message: LocalMessage
) {
  queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
    console.log("oldData", oldData);
    return {
      data: {
        messages: [...(oldData?.data.messages || []), message],
        pinnedMessage: oldData?.data.pinnedMessage || null,
      },
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
    const newData = oldData.data.messages.filter(
      (message: any) => message.id !== messageId
    );

    if (newData.length > 0) {
      previousMessageInfo = {
        lastMessage: newData[newData.length - 1].content,
        lastMessageDate: newData[newData.length - 1].createdAt,
      };
    }

    return {
      data: {
        messages: newData,
        pinnedMessage: oldData.data.pinnedMessage,
      },
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
          if (!a.lastMessageDate && !b.lastMessageDate) return 0;
          if (!a.lastMessageDate) return 1;
          if (!b.lastMessageDate) return -1;

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

export function updateMessagesStatusOnPinMessage(
  queryClient: QueryClient,
  chatId: number,
  messageId: number,
  isPinned: boolean
) {
  queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
    const messageIndex = oldData.data.messages.findIndex(
      (message: any) => message.id === messageId
    );

    const newData = [...oldData.data.messages];

    newData[messageIndex] = {
      ...newData[messageIndex],
      isPinned,
    };

    return {
      data: {
        messages: newData,
        pinnedMessage: isPinned ? newData[messageIndex] : null,
      },
    };
  });
}
