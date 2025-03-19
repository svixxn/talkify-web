import {
  useFetchChatInfo,
  useFetchChatMessages,
  useSendMessage,
} from "@/hooks/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import ChatMessage from "./ChatMessage";
import ChatDropdownMenu from "./ChatDropdownMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../shared/SocketProvider";
import { useQueryClient } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import { useUserContext } from "../shared/UserContext";
import { ResizablePanel } from "../ui/resizable";
import { useChatContext } from "../shared/ChatContext";
import { ArrowLeftFromLine, Sparkles, Users, X } from "lucide-react";
import MainChatAreaLoader from "./MainChatAreaLoader";
import { updateMessagesStatusOnNewMessage } from "@/lib/chats/helpers";
import ChatEmptyState from "../shared/ChatEmptyState";
import { Dialog, DialogTrigger } from "../ui/dialog";
import ChatInfoModal from "./ChatInfoModal";
import UserInfoModal from "../profile/UserInfoModal";
import ChatInput from "./ChatInput";

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

  const [replyMessage, setReplyMessage] = useState<{
    id: number;
    content: string;
    sender: string;
  } | null>(null);

  const chatInputRef = useRef<HTMLInputElement>(null);

  const messagesAreaRef = useRef<HTMLDivElement>(null);

  const { setCurrentChatId } = useChatContext();

  const socket = useSocket();
  const queryClient = useQueryClient();

  const { mutateAsync: sendMessage } = useSendMessage();

  const scrollToBottom = useCallback(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (chatMessages?.data && chatInfo?.data) {
      scrollToBottom();
    }

    if (chatMessages?.error) {
      setCurrentChatId(null);
    }
  }, [chatMessages, chatInfo, scrollToBottom, setCurrentChatId]);

  useEffect(() => {
    chatInputRef.current?.focus();
  }, [replyMessage]);

  const handleSendMessage = async (message?: string, files?: string[]) => {
    if ((!message && !files) || !socket || !user) return;

    const id = Math.floor(Math.random() * 1000000);

    const newMessageLocal = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      senderId: user.id,
      chatId: currentChatId,
      content: message || "",
      messageType: "text",
      senderAvatar: user.avatar,
      senderName: user.name,
      parentId: replyMessage?.id || null,
      parentMessage: replyMessage,
      files: files || [],
    };

    updateMessagesStatusOnNewMessage(
      queryClient,
      currentChatId,
      newMessageLocal
    );

    socket.emit("chat-message", JSON.stringify(newMessageLocal));

    setReplyMessage(null);

    await sendMessage({
      id: newMessageLocal.id,
      chatId: currentChatId,
      content: newMessageLocal.content,
      messageType: "text",
      parentId: newMessageLocal.parentId,
      files: newMessageLocal.files,
    });
  };

  const onCancelReply = () => {
    setReplyMessage(null);
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
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage
                    src={chatInfo?.data?.chatInfo.photo}
                    alt="Avatar"
                  />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="font-medium">
                  {chatInfo?.data?.chatInfo.name}
                </div>
              </button>
            </DialogTrigger>
            {chatInfo?.data?.chatInfo.isGroup ? (
              <ChatInfoModal
                id={currentChatId}
                name={chatInfo?.data?.chatInfo.name!}
                photo={chatInfo?.data?.chatInfo.photo!}
                participants={chatInfo?.data?.participants!}
                description={chatInfo?.data?.chatInfo.description}
              />
            ) : (
              <UserInfoModal
                userId={
                  chatInfo?.data?.participants.find((u) => u.id != user?.id)
                    ?.id || 0
                }
              />
            )}
          </Dialog>
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
          <div ref={messagesAreaRef} className="grid gap-4">
            {chatMessages?.data?.map((message) => (
              <ChatMessage
                files={message.files}
                id={message.id}
                chatId={currentChatId}
                key={message.id}
                message={message.content}
                isCurrentUserSender={user?.id === message.senderId}
                avatar={message.senderAvatar}
                timestamp={new Date(message.createdAt)}
                senderName={message.senderName}
                parentMessage={message.parentMessage}
                setReplyMessage={setReplyMessage}
                isSystem={message.isSystem}
              />
            ))}
          </div>
        </ScrollArea>
      )}
      <ChatInput
        chatId={currentChatId}
        replyMessage={replyMessage}
        onCancelReply={onCancelReply}
        onSendMessage={handleSendMessage}
        chatInputRef={chatInputRef}
      />
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
