import { QueryClient } from "react-query";
import {
  updateMessagesStatusOnDeleteMessage,
  updateMessagesStatusOnNewMessage,
  updateMessagesStatusOnPinMessage,
} from "./chats";

export const handleReceivedMessage = (
  queryClient: QueryClient,
  newChatData: string
) => {
  const parsedData = JSON.parse(newChatData);
  updateMessagesStatusOnNewMessage(queryClient, parsedData.chatId, parsedData);
};

export const handleDeletedChat = (queryClient: QueryClient, chatId: number) => {
  queryClient.setQueryData(["chats", { searchValue: "" }], (oldData: any) => {
    return {
      data: oldData.data.filter((chat: any) => chat.chatId !== chatId),
    };
  });
};

export const handleDeleteMessage = (
  queryClient: QueryClient,
  newChatData: string
) => {
  const parsedData: { chatId: number; messageId: number } =
    JSON.parse(newChatData);
  updateMessagesStatusOnDeleteMessage(
    queryClient,
    parsedData.chatId,
    parsedData.messageId
  );
};

export const handlePinMessage = (
  queryClient: QueryClient,
  newChatData: string
) => {
  const parsedData: {
    chatId: number;
    messageId: number;
    isPinned: boolean;
  } = JSON.parse(newChatData);
  updateMessagesStatusOnPinMessage(
    queryClient,
    parsedData.chatId,
    parsedData.messageId,
    parsedData.isPinned
  );
};
