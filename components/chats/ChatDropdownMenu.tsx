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
import { useDeleteChat } from "@/hooks/react-query";
import { useToast } from "@/hooks/use-toast";

type Props = {
  chatId: number;
};

const ChatDropdownMenu = ({ chatId }: Props) => {
  const { toast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { mutateAsync: deleteChatAction } = useDeleteChat();

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

    setDeleteModalOpen(false);
  };

  return (
    <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>View profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircleOff className="mr-2 h-4 w-4" />
              <span>Clear history</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => setDeleteModalOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete chat</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the chat
            and all its messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteChat}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChatDropdownMenu;
