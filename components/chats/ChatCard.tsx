import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { parseMessageDate } from "@/utils/general";

type ChatCardProps = {
  name: string;
  profilePictureSrc: string;
  message: string;
  time: string;
};

const ChatCard = ({
  name,
  profilePictureSrc,
  message,
  time,
}: ChatCardProps) => {
  return (
    <Link
      href="#"
      className="flex items-center gap-3 rounded-md bg-muted/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
      prefetch={false}
    >
      <Avatar className="h-8 w-8 border">
        <AvatarImage src={profilePictureSrc} alt="Avatar" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <div className="font-medium">{name}</div>
        <div className="text-muted-foreground">{message}</div>
      </div>
      <div className="text-xs text-muted-foreground">
        {parseMessageDate(time)}
      </div>
    </Link>
  );
};

export default ChatCard;
