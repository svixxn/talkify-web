"use client";

import { useFetchUserChats } from "@/hooks/react-query";
import { GeneralChatInfo } from "@/types";
import ChatCard from "./ChatCard";
import ChatItemSkeleton from "./ChatItemSkeleton";
import { useUserContext } from "../shared/UserContext";

type Props = {
  chats: GeneralChatInfo[] | undefined;
  currentChatId: number | null;
  isLoading: boolean;
};

const ChatList = ({ chats, isLoading, currentChatId }: Props) => {
  return (
    <div className="p-4">
      {!chats || isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from([1, 2, 3, 4, 5]).map((id) => (
            <ChatItemSkeleton key={id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {chats?.map((chat) => (
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
      )}
    </div>
  );
};

export default ChatList;
