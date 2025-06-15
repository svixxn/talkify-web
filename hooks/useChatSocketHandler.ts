import { useSocket } from "@/components/shared/SocketProvider";
import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { useToast } from "./useToast";
import { DefaultApiResponse, GeneralChatInfo } from "@/types";
import { useChatContext } from "@/components/shared/ChatContext";
import useScreenSize from "./useScreenWidth";
import {
  updateMessagesStatusOnDeleteMessage,
  updateMessagesStatusOnNewMessage,
  updateMessagesStatusOnPinMessage,
} from "@/lib/websocket/chats";
import {
  handleDeletedChat,
  handleDeleteMessage,
  handlePinMessage,
  handleReceivedMessage,
} from "@/lib/websocket/eventHandlers";

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
  const areEventsInitialized = useRef(false);

  const { hasJoinedChats, setHasJoinedChats, currentChatId, setCurrentChatId } =
    useChatContext();

  const currentChatIdRef = useRef<number | null>(currentChatId);

  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

  useEffect(() => {
    if (socket && !areEventsInitialized.current) {
      areEventsInitialized.current = true;
      socket.on("received-message", (newChatData) =>
        handleReceivedMessage(queryClient, newChatData)
      );

      socket.on("delete-chat", (chatId) => {
        if (chatId === currentChatIdRef.current) setCurrentChatId(null);
        handleDeletedChat(queryClient, chatId);
      });

      socket.on("delete-message", (newChatData) =>
        handleDeleteMessage(queryClient, newChatData)
      );

      socket.on("pin-message", (newChatData) =>
        handlePinMessage(queryClient, newChatData)
      );

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
