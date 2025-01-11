import { useSocket } from "@/components/shared/SocketProvider";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useToast } from "./use-toast";
import { DefaultApiResponse, GeneralChatInfo } from "@/types";
import { useChatContext } from "@/components/shared/ChatContext";
import useScreenSize from "./useScreenWidth";
import {
  updateMessagesStatusOnDeleteMessage,
  updateMessagesStatusOnNewMessage,
} from "@/lib/chats/helpers";

type UseChatSocketHandlerProps = {
  previousDataLength: number;
  setPreviousDataLength: (value: number) => void;
  userChats: DefaultApiResponse<GeneralChatInfo[]> | undefined;
};

export const useChatSocketHandler = ({
  previousDataLength,
  setPreviousDataLength,
  userChats,
}: UseChatSocketHandlerProps) => {
  const { toast } = useToast();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { hasJoinedChats, setHasJoinedChats, currentChatId, setCurrentChatId } =
    useChatContext();

  useEffect(() => {
    if (socket) {
      const handleReceivedMessage = (newChatData: string) => {
        const parsedData = JSON.parse(newChatData);
        updateMessagesStatusOnNewMessage(
          queryClient,
          parsedData.chatId,
          parsedData
        );
      };

      const handleDeletedChat = (chatId: number) => {
        if (chatId === currentChatId) setCurrentChatId(null);

        queryClient.setQueryData(
          ["chats", { searchValue: "" }],
          (oldData: any) => {
            return {
              data: oldData.data.filter((chat: any) => chat.chatId !== chatId),
            };
          }
        );
      };

      const handleDeleteMessage = (newChatData: string) => {
        const parsedData: { chatId: number; messageId: number } =
          JSON.parse(newChatData);
        //TODO: reimplement this function so if suer hasnt fetched the messages yet, it doesnt break
        updateMessagesStatusOnDeleteMessage(
          queryClient,
          parsedData.chatId,
          parsedData.messageId
        );
      };

      socket.on("received-message", handleReceivedMessage);
      socket.on("delete-chat", handleDeletedChat);
      socket.on("delete-message", handleDeleteMessage);

      return () => {
        socket.off("received-message", handleReceivedMessage);
        socket.off("delete-chat", handleDeletedChat);
        socket.off("delete-message", handleDeleteMessage);
      };
    }
  }, [socket, queryClient, currentChatId, setCurrentChatId]);

  useEffect(() => {
    if (userChats?.error) {
      toast({
        title: userChats.error.message,
      });
    }

    if (userChats && userChats.data && userChats.data.length > 0 && socket) {
      const chatIds = userChats.data.map(
        (chat: GeneralChatInfo) => chat.chatId
      );

      setPreviousDataLength(userChats.data.length);

      if (!hasJoinedChats || previousDataLength !== userChats.data.length) {
        socket.emit("join-chats", chatIds);
        setHasJoinedChats(true);
      }
    }
  }, [userChats?.data, socket]);
};
