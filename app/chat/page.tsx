import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ChatCard from "@/components/chats/ChatCard";
import ChatMessage from "@/components/chats/ChatMessage";
import { useFetchUserChats } from "@/hooks/react-query";
import { getUserChats } from "@/hooks/react-query/functions";
import ChatList from "@/components/chats/ChatList";
import { redirect } from "next/navigation";
import ErrorPage from "@/components/shared/ErrorPage";

const ChatPage = async () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden w-1/4 border-r bg-muted/40 md:block">
        <div className="flex h-14 items-center border-b px-4">
          <h3 className="text-lg font-semibold">Chats</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <ChatList />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center border-b px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              {/* <AvatarImage src="/placeholder-user.jpg" alt="Avatar" /> */}
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="font-medium">Acme Inc</div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4">
            <ChatMessage
              message="test"
              isCurrentUserSender={false}
              // avatar="text.jpg"
              avatarFallback="MA"
              timestamp={new Date()}
            />
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

export default ChatPage;
