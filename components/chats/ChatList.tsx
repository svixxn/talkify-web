"use client";

import { useFetchUserChats } from "@/hooks/react-query";
import { GeneralChatInfo } from "@/types";
import ChatCard from "./ChatCard";
import ChatItemSkeleton from "./ChatItemSkeleton";

const ChatList = () => {
  const { data: userChats, isLoading } = useFetchUserChats(1);
  return (
    <div className="p-4">
      {!userChats?.data && isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from([1, 2, 3, 4, 5]).map((id) => (
            <ChatItemSkeleton key={id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {userChats?.data?.map((chat) => (
            <ChatCard
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
