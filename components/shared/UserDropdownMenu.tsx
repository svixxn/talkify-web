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
import { useEffect, useState } from "react";
import UserInfoModal from "../profile/UserInfoModal";
import { useUserContext } from "./UserContext";
type Props = {
  username: string | undefined;
};

const UserDropdownMenu = ({ username }: Props) => {
  const { user } = useUserContext();
  const [createChatModalOpen, setCreateChatModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = async () => {
    await axios.delete("/api/login");
    router.replace("/");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCreateChatModalOpen(false);
      setProfileModalOpen(false);
    }
  };

  return (
    <Dialog
      open={createChatModalOpen || profileModalOpen}
      onOpenChange={handleOpenChange}
    >
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
              <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
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
              <DropdownMenuItem onClick={() => setCreateChatModalOpen(true)}>
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
      {createChatModalOpen && (
        <CreateChatModal setOpen={setCreateChatModalOpen} />
      )}
      {profileModalOpen && <UserInfoModal userId={user?.id || 0} />}
    </Dialog>
  );
};

export default UserDropdownMenu;
