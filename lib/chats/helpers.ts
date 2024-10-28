import { GeneralChatInfo } from "@/types";
import { QueryClient } from "react-query";

export function updateMessagesStatus(
  queryClient: QueryClient,
  chatId: number,
  message: any
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
