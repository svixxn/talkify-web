"use client";

import {
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "../ui/dialog";
import CreateChatModal from "../chats/CreateChatModal";
import { useState } from "react";

type Props = {
  username: string | undefined;
};

const UserDropdownMenu = ({ username }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = async () => {
    const res = await axios.delete("/api/login");
    router.replace("/signin");
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Menu size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mx-2">
          <DropdownMenuLabel>{username || "User"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {pathname.includes("home") ? (
              <DropdownMenuItem onClick={() => router.push("/chat")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Chat</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => router.push("/home")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Search users</span>
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => setModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Chat</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateChatModal open={modalOpen} setOpen={setModalOpen} />
    </Dialog>
  );
};

export default UserDropdownMenu;
