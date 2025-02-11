"use client";

import { useFetchUserChats } from "@/hooks/react-query";
import { GeneralChatInfo, User } from "@/types";
import ChatCard from "./ChatCard";
import ChatItemSkeleton from "./ChatItemSkeleton";
import UserDropdownMenu from "../shared/UserDropdownMenu";
import { useState } from "react";
import { useChatContext } from "../shared/ChatContext";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { ResizablePanel } from "../ui/resizable";
import { useChatSocketHandler } from "@/hooks/useChatSocketHandler";
import useScreenSize from "@/hooks/useScreenWidth";

type Props = {
  user: User | null;
  isUserLoading: boolean;
};

const ChatSideMenu = ({ user, isUserLoading }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [previousDataLength, setPreviousDataLength] = useState(0);
  const { screenSize } = useScreenSize();

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data: userChats, isLoading: isChatsLoading } =
    useFetchUserChats(debouncedSearchValue);

  const { currentChatId } = useChatContext();

  useChatSocketHandler({
    previousDataLength,
    setPreviousDataLength,
    userChats,
  });

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
      defaultSize={screenSize === "small" && !currentChatId ? 100 : 30}
      minSize={20}
      maxSize={70}
      className={`w-full rounded-l-xl border backdrop-blur-sm shadow-2xl bg-muted/40 ${
        screenSize === "small" ? "hidden" : "block"
      }`}
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
