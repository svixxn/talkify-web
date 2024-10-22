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
    return {
      data: oldData.data.map((chat: any) => {
        if (chat.chatId === chatId) {
          return {
            ...chat,
            lastMessage: message.content,
            lastMessageDate: message.createdAt,
          };
        }
        return chat;
      }),
    };
  });
}
