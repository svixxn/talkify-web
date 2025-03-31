import { useDeleteChatMessage } from "@/hooks/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useToast } from "@/hooks/use-toast";
import { updateMessagesStatusOnDeleteMessage } from "@/lib/chats/helpers";
import { useQueryClient } from "react-query";
import { useSocket } from "../shared/SocketProvider";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Bot, Download, Reply } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogTrigger } from "../ui/dialog";
import UserInfoModal from "../profile/UserInfoModal";

type Props = {
  id: number;
  message: string;
  isCurrentUserSender: boolean;
  timestamp: Date;
  avatar?: string;
  chatId: number;
  senderName: string;
  senderId: number;
  files: string[];
  isSystem: boolean;
  isGroup: boolean;
  parentMessage?: {
    id: number;
    content: string;
    sender: string;
  };
  setReplyMessage: React.Dispatch<
    React.SetStateAction<{ id: number; content: string; sender: string } | null>
  >;
};
const ChatMessage = ({
  message,
  isCurrentUserSender,
  timestamp,
  avatar,
  chatId,
  id,
  setReplyMessage,
  senderName,
  parentMessage,
  files,
  isSystem,
  isGroup,
  senderId,
}: Props) => {
  const { toast } = useToast();
  const { mutateAsync: deleteChatMessageAction } = useDeleteChatMessage();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const handleDeleteFunction = async () => {
    updateMessagesStatusOnDeleteMessage(queryClient, chatId, id);
    socket?.emit("delete-message", JSON.stringify({ chatId, messageId: id }));
    const res = await deleteChatMessageAction({ messageId: id, chatId });
    if (res.error) {
      toast({
        title: "An error occurred while deleting the message",
      });
      return;
    }
  };

  const handleRespondMessage = () => {
    setReplyMessage((prev) => ({
      ...prev,
      id,
      content: message,
      sender: senderName,
    }));
  };

  const getImageClassnames = (index: number) => {
    if (files.length === 1) {
      return "rounded-t-xl";
    } else {
      if (index === 0) {
        return "rounded-tl-xl";
      } else if (
        (index === files.length - 1 && files.length < 4) ||
        index % 3 === 0
      ) {
        return "rounded-tr-xl";
      }

      return "";
    }
  };

  if (isSystem) {
    return (
      <div className="flex flex-col items-center gap-2 my-8 px-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ring-2 ring-primary/20">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 rounded-xl blur-xl" />
          <div className="relative bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
            <p className="text-sm text-primary">{message}</p>
            <span className="text-xs text-primary/60 mt-2 block">
              {timestamp.getHours().toString().padStart(2, "0") +
                ":" +
                timestamp.getMinutes().toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {parentMessage && (
        <div
          className={cn(
            "flex items-center gap-2 text-xs mb-2 text-muted-foreground",
            isCurrentUserSender ? "justify-end mr-3" : "ml-3"
          )}
        >
          <span>Replying to</span>
          <span className="font-medium text-primary">
            {parentMessage.sender}
          </span>
          <span className="truncate max-w-[200px]">
            {parentMessage.content}
          </span>
        </div>
      )}
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-start gap-3 ${
                isCurrentUserSender && "justify-end"
              }`}
            >
              {!isCurrentUserSender && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button>
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={avatar} alt="Avatar" />
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                    </button>
                  </DialogTrigger>

                  <UserInfoModal userId={senderId} />
                </Dialog>
              )}
              <div className="flex flex-row max-w-[75%] items-center group gap-2">
                <div className="flex flex-col gap-1">
                  <div
                    className={`rounded-2xl flex items-center gap-2 ${
                      isCurrentUserSender
                        ? "message-own text-primary-foreground rounded-br-sm"
                        : "message-system text-primary rounded-bl-sm"
                    } text-sm`}
                  >
                    <div className={`flex flex-col px-3`}>
                      {!isCurrentUserSender && isGroup && (
                        <div className="mb-1 pt-2">
                          <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            {senderName}
                          </span>
                        </div>
                      )}
                      {files?.length > 0 && (
                        <div
                          className={`${
                            files.length > 4 ? "grid grid-cols-4" : "flex"
                          } gap-1`}
                        >
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="relative group/image mt-3"
                            >
                              <Image
                                width={files.length > 1 ? 250 : 350}
                                height={files.length > 1 ? 250 : 350}
                                src={file}
                                alt={file}
                                className={cn(
                                  "max-h-[350px] object-fill",
                                  getImageClassnames(index)
                                )}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => window.open(file, "_blank")}
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <p className="break-all">{message}</p>
                        <span
                          className={`text-[10px] opacity-80 ml-auto pt-3 ${
                            message === "" && "pr-3"
                          }`}
                        >
                          {timestamp.getHours().toString().padStart(2, "0") +
                            ":" +
                            timestamp.getMinutes().toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRespondMessage}
                >
                  <Reply className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <AlertDialogTrigger className="w-full">
              <ContextMenuItem className="text-red-500">Delete</ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
        </ContextMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete this message for you and for your
              interlocutor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFunction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatMessage;
