import {
  useFetchChatInfo,
  useFetchChatMessages,
  useSendMessage,
} from "@/hooks/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ChatMessage from "./ChatMessage";
import ChatDropdownMenu from "./ChatDropdownMenu";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { useSocket } from "../shared/SocketProvider";
import { ChatMessage as ChatMessageType } from "@/types";
import { useQueryClient } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import { useUserContext } from "../shared/UserContext";
import MainChatAreaLoader from "./MainChatAreaLoader";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
// import useSocket from "@/hooks/useSocket";

type Props = {
  currentChatId: number;
};

const MainChatArea = ({ currentChatId }: Props) => {
  const { data: chatInfo, isLoading: isChatInfoLoading } =
    useFetchChatInfo(currentChatId);
  const { data: chatMessages, isLoading: isChatMessagesLoading } =
    useFetchChatMessages(currentChatId);
  const { user } = useUserContext();
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  const socket = useSocket();
  const queryClient = useQueryClient();

  const { mutateAsync: sendMessage } = useSendMessage();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-chat", currentChatId);

    const handleReceivedMessage = (data: string) => {
      queryClient.setQueryData(
        ["chatMessages", currentChatId],
        (oldData: any) => {
          return {
            data: [...(oldData?.data || []), JSON.parse(data)],
          };
        }
      );
    };

    socket.on("received-message", handleReceivedMessage);

    return () => {
      socket.off("received-message", handleReceivedMessage);
    };
  }, [socket, currentChatId, queryClient]);

  const scrollToBottom = useCallback(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    if (chatMessages?.data) {
      scrollToBottom();
    }
  }, [chatMessages, scrollToBottom]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!chatInputRef.current || chatInputRef.current?.value.trim() === "")
      return;

    const newMessage = chatInputRef.current.value;

    chatInputRef.current.value = "";

    const data = await sendMessage({
      chatId: currentChatId,
      content: newMessage,
      messageType: "text",
    });

    const message = {
      ...data.data.message,
      senderAvatar: user?.avatar,
    } as ChatMessageType;

    socket?.emit("chat-message", JSON.stringify(message));
  };

  if (isChatInfoLoading || isChatMessagesLoading) {
    return (
      <div className="flex flex-row items-center justify-center">
        <MainChatAreaLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div
        id="first_section"
        className="flex py-2 items-center border-b px-4 md:px-6"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={chatInfo?.data?.chatInfo.photo} alt="Avatar" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="font-medium">{chatInfo?.data?.chatInfo.name}</div>
        </div>

        <div className="ml-auto">
          <ChatDropdownMenu chatId={currentChatId} />
        </div>
      </div>

      <ScrollArea className="p-4 h-screen">
        <div ref={messagesAreaRef} className="grid gap-4">
          {chatMessages?.data?.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isCurrentUserSender={user?.id === message.senderId}
              avatar={message.senderAvatar}
              timestamp={new Date(message.createdAt)}
            />
          ))}
        </div>
      </ScrollArea>
      <form
        onSubmit={handleSendMessage}
        className="flex items-center px-4 py-2 md:px-6 gap-2"
      >
        <Input
          ref={chatInputRef}
          placeholder="Type your message..."
          className="h-16 flex-1 resize-none rounded-md border border-input bg-transparent pr-20 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button type="submit" size="icon" className="absolute right-12">
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
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
