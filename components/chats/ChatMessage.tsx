import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  message: string;
  isCurrentUserSender: boolean;
  timestamp: Date;
  avatar?: string;
  avatarFallback: string;
};
const ChatMessage = ({
  message,
  isCurrentUserSender,
  timestamp,
  avatar,
  avatarFallback,
}: Props) => {
  return (
    <div
      className={`flex items-start gap-3 ${
        isCurrentUserSender && "justify-end"
      }`}
    >
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={avatar} alt="Avatar" />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div
        className={`rounded-md flex items-center gap-2 ${
          isCurrentUserSender
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50"
        } text-sm`}
      >
        <p className="py-2 pl-2">{message}</p>
        <span className="text-[10px] opacity-80 mt-auto p-1">
          {timestamp.getHours() + ":" + timestamp.getMinutes()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
