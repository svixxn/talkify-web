"use client";

import { useFetchUserChats } from "@/hooks/react-query";
import ChatSideMenu from "@/components/chats/ChatSideMenu";
import { useUserContext } from "@/components/shared/UserContext";
import { useEffect, useState } from "react";
import { useChatContext } from "@/components/shared/ChatContext";
import { useToast } from "@/hooks/use-toast";
import MainChatArea from "@/components/chats/MainChatArea";
import UserDropdownMenu from "@/components/shared/UserDropdownMenu";
import ChatItemSkeleton from "@/components/chats/ChatItemSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import MainChatAreaLoader from "@/components/chats/MainChatAreaLoader";

const ChatPage = () => {
  const { user, isLoading: isUserLoading } = useUserContext();
  const { currentChatId } = useChatContext();

  return (
    <div className="flex h-screen w-full bg-background">
      <ChatSideMenu
        currentChatId={currentChatId}
        isUserLoading={isUserLoading || false}
        user={user}
      />

      {currentChatId ? (
        <MainChatArea currentChatId={currentChatId} />
      ) : (
        <div className="px-4 md:px-6 flex items-center justify-center w-3/4">
          {isUserLoading ? (
            <MainChatAreaLoader />
          ) : (
            <span> No chats found </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
