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
import {
  useClearChatHistory,
  useDeleteChat,
  useLeaveChat,
} from "@/hooks/react-query";
import { useToast } from "@/hooks/useToast";
import { useChatContext } from "../shared/ChatContext";
import { useSocket } from "../shared/SocketProvider";
import RoleGuard from "../shared/RoleGuard";
import { useUserContext } from "../shared/UserContext";
import { ChatRole } from "@/types";
import { allowedRoles } from "@/utils/allowedRoles";

type Props = {
  chatId: number;
  userRole: ChatRole;
};

const ChatDropdownMenu = ({ chatId, userRole }: Props) => {
  const { toast } = useToast();
  const [actionType, setActionType] = useState<
    "clear" | "delete" | "leave" | undefined
  >(undefined);
  const { setCurrentChatId, setHasJoinedChats } = useChatContext();

  const socket = useSocket();

  const { mutateAsync: deleteChatAction } = useDeleteChat();
  const { mutateAsync: clearChatHistoryAction } = useClearChatHistory();
  const { mutateAsync: leaveChatAction } = useLeaveChat(chatId, socket);

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

  const handleLeaveChat = async () => {
    const res = await leaveChatAction();

    if (res.error) {
      toast({
        title: "An error occurred",
        description: res.error.message,
      });
      return;
    }

    toast({
      title: "You have left the chat.",
    });

    setHasJoinedChats(false);
    setCurrentChatId(null);
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
      case "leave":
        return (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will remove you from the chat
                and you will no longer receive messages from it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeaveChat}>
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
            <RoleGuard
              userRole={userRole}
              allowedRoles={allowedRoles.chatActions}
            >
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
            </RoleGuard>
            <DropdownMenuItem onClick={() => setActionType("leave")}>
              <User className="mr-2 h-4 w-4" />
              <span>Leave chat</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {getModalContentByActionType()}
    </AlertDialog>
  );
};

export default ChatDropdownMenu;
