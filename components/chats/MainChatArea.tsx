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
import { ArrowLeftFromLine, Pin, Sparkles, Users, X } from "lucide-react";
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

  const { mutateAsync: sendMessage } = useSendMessage();

  const { setCurrentChatId } = useChatContext();
  const { user } = useUserContext();

  const socket = useSocket();
  const queryClient = useQueryClient();

  const pinnedMessage = chatMessages?.data
    ?.filter((message) => message.isPinned)
    .reverse()[0];

  const [replyMessage, setReplyMessage] = useState<{
    id: number;
    content: string;
    sender: string;
  } | null>(null);

  const chatInputRef = useRef<HTMLInputElement>(null);

  const messagesAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollIntoView({
        block: "end",
        behavior: "instant",
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
    if ((!message && files?.length === 0) || !socket || !user) return;

    const newMessageLocal = {
      id: Math.floor(Math.random() * 1000000),
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
      isSystem: false,
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

  const scrollToMessage = (messageId: number) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bg-primary/10");
      setTimeout(() => {
        element.classList.remove("bg-primary/10");
      }, 1000);
    }
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

      {pinnedMessage && (
        <div className="border-b border-accent bg-black/10">
          <div className="p-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <Pin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                pinned message
              </span>
            </div>
            <div className="space-y-2">
              <button
                key={`pinned-${pinnedMessage.id}`}
                onClick={() => scrollToMessage(pinnedMessage.id)}
                className="w-full p-2 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-primary">
                    {pinnedMessage.senderName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(pinnedMessage.createdAt)
                      .getHours()
                      .toString()
                      .padStart(2, "0") +
                      ":" +
                      new Date(pinnedMessage.createdAt)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {pinnedMessage.content}
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

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
                isGroup={chatInfo?.data?.chatInfo.isGroup!}
                senderId={message.senderId}
                isPinned={message.isPinned}
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

export default MainChatArea;
