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

type Props = {
  id: number;
  message: string;
  isCurrentUserSender: boolean;
  timestamp: Date;
  avatar?: string;
  chatId: number;
};
const ChatMessage = ({
  message,
  isCurrentUserSender,
  timestamp,
  avatar,
  chatId,
  id,
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

  return (
    <AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger>
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
              className={`rounded-2xl flex items-center max-w-72 gap-2 ${
                isCurrentUserSender
                  ? "message-own text-primary-foreground rounded-br-sm"
                  : "message-system text-primary rounded-bl-sm"
              } text-sm`}
            >
              <p className="pl-2 py-2 break-all">{message}</p>
              <span className="text-[10px] opacity-80 mt-auto p-1 pr-2">
                {timestamp.getHours() + ":" + timestamp.getMinutes()}
              </span>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <AlertDialogTrigger>
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
  );
};

export default ChatMessage;
