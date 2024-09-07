import { useFetchChatInfo } from "@/hooks/react-query";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ChatMessage from "./ChatMessage";

type Props = {
  currentChatId: number;
  currentUserId: number | undefined;
};

const MainChatArea = ({ currentChatId, currentUserId }: Props) => {
  const { data: chatInfo, isLoading } = useFetchChatInfo(currentChatId);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-14 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="font-medium">{chatInfo?.data?.chatInfo.name}</div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-4">
          {chatInfo?.data?.chatMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isCurrentUserSender={currentUserId === message.senderId}
              // avatar="text.jpg"
              avatarFallback="MA"
              timestamp={new Date()}
            />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-background px-4 py-2 md:px-6">
        <div className="relative flex items-center gap-2">
          <Textarea
            placeholder="Type your message..."
            className="h-10 flex-1 resize-none rounded-md border border-input bg-transparent pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" size="icon" className="absolute right-2">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default MainChatArea;
