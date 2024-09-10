"use client";

import { useFetchUserChats } from "@/hooks/react-query";
import ChatList from "@/components/chats/ChatList";
import { useUserContext } from "@/components/shared/UserContext";
import { useEffect, useState } from "react";
import { useChatContext } from "@/components/shared/ChatContext";
import { useToast } from "@/hooks/use-toast";
import MainChatArea from "@/components/chats/MainChatArea";
import UserDropdownMenu from "@/components/chats/UserDropdownMenu";
import ChatItemSkeleton from "@/components/chats/ChatItemSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import MainChatAreaLoader from "@/components/chats/MainChatAreaLoader";

const ChatPage = () => {
  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUserContext();
  const { data: userChats, isLoading } = useFetchUserChats(user?.id || 0);
  const { currentChatId, setCurrentChatId } = useChatContext();

  useEffect(() => {
    if (userChats?.error) {
      toast({
        title: userChats.error.message,
      });
    }

    if (userChats && userChats.data && userChats.data.length > 0) {
      setCurrentChatId(userChats.data[0].chatId);
    }
  }, [userChats?.data, setCurrentChatId, toast, userChats]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden w-1/4 border-r bg-muted/40 md:block">
        <div className="flex flex-row gap-4 h-14 items-center border-b px-4">
          <UserDropdownMenu username={user?.name} />
          <h3 className="text-lg font-semibold">Chats</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <ChatList
            chats={userChats?.data}
            currentChatId={currentChatId}
            isLoading={isUserLoading || isLoading}
          />
        </div>
      </div>

      {currentChatId ? (
        <MainChatArea currentChatId={currentChatId} currentUserId={user?.id} />
      ) : (
        <div className="px-4 md:px-6 flex items-center justify-center w-3/4">
          {isLoading ? <MainChatAreaLoader /> : <span> No chats found </span>}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
