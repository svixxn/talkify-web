import {
  useFetchChatInfo,
  useFetchChatMessages,
  useSendMessage,
} from "@/hooks/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import ChatMessage from "./ChatMessage";
import ChatDropdownMenu from "./ChatDropdownMenu";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../shared/SocketProvider";
import { ChatMessage as ChatMessageType } from "@/types";
import { useQueryClient } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import { useUserContext } from "../shared/UserContext";
import { Input } from "../ui/input";
import { ResizablePanel } from "../ui/resizable";
import { useChatContext } from "../shared/ChatContext";
import { ArrowLeftFromLine, Sparkles, Users } from "lucide-react";
import MainChatAreaLoader from "./MainChatAreaLoader";
import { updateMessagesStatus } from "@/lib/chats/helpers";
import { cn } from "@/lib/utils";
import ChatEmptyState from "../shared/ChatEmptyState";

type Props = {
  currentChatId: number;
  screenSize: "small" | "full";
};

const MainChatArea = ({ currentChatId, screenSize }: Props) => {
  const { data: chatInfo, isLoading: isChatInfoLoading } =
    useFetchChatInfo(currentChatId);
  const { data: chatMessages, isLoading: isChatMessagesLoading } =
    useFetchChatMessages(currentChatId);
  const { user } = useUserContext();
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const { setCurrentChatId } = useChatContext();

  const socket = useSocket();
  const queryClient = useQueryClient();

  const { mutateAsync: sendMessage } = useSendMessage();

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

    if (chatMessages?.error) {
      setCurrentChatId(null);
    }
  }, [chatMessages, scrollToBottom, setCurrentChatId]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !chatInputRef.current ||
      chatInputRef.current?.value.trim() === "" ||
      !socket
    )
      return;

    const localOffset = new Date().getTimezoneOffset() * 60000;

    const nowWithOffset = new Date(Date.now() - localOffset);

    const newMessageLocal = {
      id: Date.now(),
      createdAt: nowWithOffset.toISOString(),
      updatedAt: nowWithOffset.toISOString(),
      senderId: user?.id,
      chatId: currentChatId,
      content: chatInputRef.current?.value,
      messageType: "text",
      senderAvatar: user?.avatar,
    };

    updateMessagesStatus(queryClient, currentChatId, newMessageLocal);

    socket.emit("chat-message", JSON.stringify(newMessageLocal));

    chatInputRef.current.value = "";

    await sendMessage({
      chatId: currentChatId,
      content: newMessageLocal.content,
      messageType: "text",
    });
  };

  if (isChatInfoLoading || isChatMessagesLoading) {
    return (
      <ResizablePanel
        defaultSize={70}
        className="flex flex-col items-center justify-center flex-1"
      >
        <MainChatAreaLoader />
      </ResizablePanel>
    );
  }

  return (
    <ResizablePanel
      defaultSize={70}
      className="flex flex-col backdrop-blur-sm shadow-2xl flex-1 md:border md:rounded-r-xl"
    >
      <div
        id="first_section"
        className="flex py-2 items-center border-b px-4 md:px-6"
      >
        <div className="flex items-center gap-3">
          {screenSize === "small" && (
            <Button
              size="icon"
              className="bg-transparent"
              onClick={() => {
                setCurrentChatId(null);
              }}
            >
              <ArrowLeftFromLine className="text-white hover:text-background" />
            </Button>
          )}
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

      {chatMessages?.data?.length === 0 ? (
        <ChatEmptyState
          title="No messages yet"
          icon={<Sparkles className="w-10 h-10 animate-pulse" />}
          description="Start the conversation by sending the first message"
        />
      ) : (
        <ScrollArea className="p-4 h-screen">
          <div
            ref={messagesAreaRef}
            className="grid gap-4 backdrop-blur-sm shadow-2xl"
          >
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
      )}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center px-4 py-2 md:px-6 gap-2"
      >
        <Input
          ref={chatInputRef}
          placeholder="Type your message..."
          className="h-16 flex-1 resize-none rounded-md border border-input pr-20 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button type="submit" size="icon" className="absolute right-12">
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </ResizablePanel>
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
