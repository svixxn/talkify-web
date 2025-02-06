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
import { Download, Reply } from "lucide-react";

type Props = {
  id: number;
  message: string;
  isCurrentUserSender: boolean;
  timestamp: Date;
  avatar?: string;
  chatId: number;
  senderName: string;
  files: string[];
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
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={avatar} alt="Avatar" />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-row items-center group gap-2">
                <div
                  className={`rounded-2xl flex items-center max-w-72 gap-2 ${
                    isCurrentUserSender
                      ? "message-own text-primary-foreground rounded-br-sm"
                      : "message-system text-primary rounded-bl-sm"
                  } text-sm`}
                >
                  <div className="flex flex-col">
                    {files?.length > 0 && (
                      <div className="flex gap-1 p-1">
                        {files.map((file, index) => (
                          <div key={index} className="relative group/image">
                            <img
                              src={file}
                              alt={file}
                              className={`${
                                files.length === 1
                                  ? "rounded-t-xl"
                                  : `${
                                      index === 0
                                        ? "rounded-tl-xl"
                                        : `${
                                            index === files.length - 1
                                              ? "rounded-tr-xl"
                                              : ""
                                          }`
                                    }`
                              } max-h-[200px] object-cover`}
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
                      <p className="pl-2 py-2 break-all">{message}</p>
                      <span className="text-[10px] opacity-80 mt-auto ml-auto p-1 pr-2">
                        {timestamp.getHours() + ":" + timestamp.getMinutes()}
                      </span>
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
