"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ChatCard from "@/components/chats/ChatCard";
import ChatMessage from "@/components/chats/ChatMessage";
import { useFetchUserChats } from "@/hooks/react-query";
import { getUserChats } from "@/hooks/react-query/functions";
import ChatList from "@/components/chats/ChatList";
import { redirect } from "next/navigation";
import ErrorPage from "@/components/shared/ErrorPage";
import { useUserContext } from "@/components/shared/UserContext";
import { useEffect, useState } from "react";
import { useChatContext } from "@/components/shared/ChatContext";
import { useToast } from "@/hooks/use-toast";
import MainChatArea from "@/components/chats/MainChatArea";

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
        <div className="flex h-14 items-center border-b px-4">
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
        <div className="flex flex-col items-center justify-center w-full">
          {isLoading ? <span>Loading...</span> : <span> No chats found </span>}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
