"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { parseMessageDate } from "@/utils/general";
import { useChatContext } from "../shared/ChatContext";

type ChatCardProps = {
  id: number;
  name: string;
  profilePictureSrc: string;
  message: string;
  time: string;
  isActive: boolean;
};

const ChatCard = ({
  id,
  name,
  profilePictureSrc,
  message,
  time,
  isActive,
}: ChatCardProps) => {
  const { setCurrentChatId } = useChatContext();

  return (
    <button
      onClick={() => setCurrentChatId(id)}
      className={`flex items-center text-left gap-3 rounded-md bg-muted/50 ${
        isActive
          ? "bg-foreground hover:bg-foreground/75"
          : "bg-muted/50 hover:bg-muted"
      } px-3 py-2 text-sm font-medium transition-colors hover:bg-muted`}
    >
      <Avatar className="h-8 w-8 border">
        <AvatarImage src={profilePictureSrc} alt="Avatar" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <div className={`font-medium ${isActive && "text-muted"}`}>{name}</div>
        <div className="text-muted-foreground">{message}</div>
      </div>
      <div className="text-xs text-muted-foreground">
        {parseMessageDate(time)}
      </div>
    </button>
  );
};

export default ChatCard;
