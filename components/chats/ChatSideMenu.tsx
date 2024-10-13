"use client";

import { useFetchUserChats } from "@/hooks/react-query";
import { GeneralChatInfo, User } from "@/types";
import ChatCard from "./ChatCard";
import ChatItemSkeleton from "./ChatItemSkeleton";
import { useUserContext } from "../shared/UserContext";
import UserDropdownMenu from "../shared/UserDropdownMenu";
import { use, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChatContext } from "../shared/ChatContext";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { ResizablePanel } from "../ui/resizable";
import { useSocket } from "../shared/SocketProvider";
import { useQueryClient } from "react-query";

type Props = {
  user: User | null;
  currentChatId: number | null;
  isUserLoading: boolean;
};

const ChatSideMenu = ({ user, isUserLoading, currentChatId }: Props) => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const { setCurrentChatId } = useChatContext();

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: userChats,
    isLoading: isChatsLoading,
    previousDataLength,
  } = useFetchUserChats(debouncedSearchValue);

  const hasJoinedChats = useRef(false);

  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userChats?.error) {
      toast({
        title: userChats.error.message,
      });
    }

    const handleReceivedMessage = (newChatData: string) => {
      const parsedData = JSON.parse(newChatData);
      queryClient.setQueryData(
        ["chatMessages", parsedData.chatId],
        (oldData: any) => {
          return {
            data: [...(oldData?.data || []), parsedData],
          };
        }
      );

      queryClient.setQueryData(
        ["chats", { searchValue: "" }],
        (oldData: any) => {
          return {
            data: oldData.data.map((chat: any) => {
              if (chat.chatId === parsedData.chatId) {
                return {
                  ...chat,
                  lastMessage: parsedData.content,
                  lastMessageDate: parsedData.createdAt,
                };
              }
              return chat;
            }),
          };
        }
      );
    };

    if (userChats && userChats.data && userChats.data.length > 0 && socket) {
      const chatIds = userChats.data.map(
        (chat: GeneralChatInfo) => chat.chatId
      );
      //TODO: fix re-joining chats on every new message
      if (!hasJoinedChats.current) {
        socket.emit("join-chats", chatIds);
        hasJoinedChats.current = true;
      }

      socket.on("received-message", handleReceivedMessage);

      return () => {
        socket.off("received-message", handleReceivedMessage);
        hasJoinedChats.current = false;
      };
    }
  }, [userChats?.data, socket]);

  const getSideMenuContent = () => {
    if (isChatsLoading || isUserLoading) {
      return (
        <div className="flex flex-col gap-4">
          {Array.from([1, 2, 3, 4, 5]).map((id) => (
            <ChatItemSkeleton key={id} />
          ))}
        </div>
      );
    }

    if (!userChats?.data || userChats.data.length === 0) {
      return <div className="mx-auto">No chats found</div>;
    }

    return (
      <div className="flex flex-col gap-2">
        {userChats.data.map((chat: GeneralChatInfo) => (
          <ChatCard
            id={chat.chatId}
            isActive={chat.chatId === currentChatId}
            key={chat.chatId}
            name={chat.name}
            message={chat.lastMessage}
            profilePictureSrc={chat.photo}
            time={chat.lastMessageDate}
          />
        ))}
      </div>
    );
  };

  return (
    <ResizablePanel
      defaultSize={30}
      minSize={15}
      maxSize={50}
      className="hidden w-1/4 border-r bg-muted/40 md:block"
    >
      <div className="flex flex-row gap-4 py-2 items-center border-b px-4">
        <UserDropdownMenu username={user?.name} />
        <h3 className="text-lg font-semibold">Chats</h3>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4">{getSideMenuContent()}</div>
      </div>
    </ResizablePanel>
  );
};

export default ChatSideMenu;
