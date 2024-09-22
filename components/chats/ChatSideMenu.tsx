"use client";

import { useFetchUserChats } from "@/hooks/react-query";
import { GeneralChatInfo, User } from "@/types";
import ChatCard from "./ChatCard";
import ChatItemSkeleton from "./ChatItemSkeleton";
import { useUserContext } from "../shared/UserContext";
import UserDropdownMenu from "../shared/UserDropdownMenu";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChatContext } from "../shared/ChatContext";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";

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
  const { data: userChats, isLoading: isChatsLoading } =
    useFetchUserChats(debouncedSearchValue);

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
    <div className="hidden w-1/4 border-r bg-muted/40 md:block">
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
    </div>
  );
};

export default ChatSideMenu;
