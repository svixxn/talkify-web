"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { parseMessageDate } from "@/utils/general";
import { useChatContext } from "../shared/ChatContext";

type ChatCardProps = {
  id: number;
  name: string;
  profilePictureSrc: string;
  message: string | null;
  time: string | null;
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
      className={`flex items-center text-left gap-3 rounded-md ${
        isActive ? "bg-muted/75 hover:bg-muted/50" : "hover:bg-muted/50"
      } px-3 py-2 text-sm font-medium transition`}
    >
      <Avatar className="h-8 w-8 border">
        <AvatarImage src={profilePictureSrc} alt="Avatar" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <div className={`font-medium`}>{name}</div>
        <div className="text-muted-foreground">{message}</div>
      </div>
      <div className="text-xs text-muted-foreground">
        {time && parseMessageDate(time)}
      </div>
    </button>
  );
};

export default ChatCard;
