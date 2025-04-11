import {
  MessageCircleOff,
  SlidersHorizontal,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import { useClearChatHistory, useDeleteChat } from "@/hooks/react-query";
import { useToast } from "@/hooks/useToast";
import { useChatContext } from "../shared/ChatContext";
import { useSocket } from "../shared/SocketProvider";

type Props = {
  chatId: number;
};

const ChatDropdownMenu = ({ chatId }: Props) => {
  const { toast } = useToast();
  const [actionType, setActionType] = useState<"clear" | "delete" | undefined>(
    undefined
  );
  const { setCurrentChatId, setHasJoinedChats } = useChatContext();

  const { mutateAsync: deleteChatAction } = useDeleteChat();
  const { mutateAsync: clearChatHistoryAction } = useClearChatHistory();
  const socket = useSocket();

  const handleDeleteChat = async () => {
    const res = await deleteChatAction(chatId);

    if (res.error) {
      toast({
        title: "An error occurred",
        description: res.error.message,
      });
      return;
    }

    toast({
      title: "Chat successfully deleted",
    });

    socket?.emit("delete-chat", chatId);

    setHasJoinedChats(false);
    setCurrentChatId(null);
    setActionType(undefined);
  };

  const handleClearHistory = async () => {
    const res = await clearChatHistoryAction(chatId);

    if (res.error) {
      toast({
        title: "An error occurred",
        description: res.error.message,
      });
      return;
    }

    toast({
      title: "History successfully cleared.",
    });

    setActionType(undefined);
  };

  const getModalContentByActionType = () => {
    switch (actionType) {
      case "clear":
        return (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will clear the chat history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearHistory}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        );
      case "delete":
        return (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                chat and all its messages.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteChat}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        );
      default:
        return null;
    }
  };

  return (
    <AlertDialog
      open={actionType !== null}
      onOpenChange={() => setActionType(undefined)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Chat settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setActionType("clear")}>
              <MessageCircleOff className="mr-2 h-4 w-4" />
              <span>Clear history</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => setActionType("delete")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete chat</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {getModalContentByActionType()}
    </AlertDialog>
  );
};

export default ChatDropdownMenu;
