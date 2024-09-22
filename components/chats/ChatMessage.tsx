import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  message: string;
  isCurrentUserSender: boolean;
  timestamp: Date;
  avatar?: string;
};
const ChatMessage = ({
  message,
  isCurrentUserSender,
  timestamp,
  avatar,
}: Props) => {
  return (
    <div
      className={`flex items-start  gap-3 ${
        isCurrentUserSender && "justify-end"
      }`}
    >
      {!isCurrentUserSender && (
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={avatar} alt="Avatar" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`rounded-md flex items-center max-w-72 gap-2 ${
          isCurrentUserSender
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50"
        } text-sm`}
      >
        <p className="py-2 pl-2 break-all">{message}</p>
        <span className="text-[10px] opacity-80 mt-auto p-1">
          {timestamp.getHours() + ":" + timestamp.getMinutes()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
