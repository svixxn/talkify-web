"use client";

import { LogOut, Menu, Plus, Settings, User, Users } from "lucide-react";

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
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "../ui/dialog";
import CreateChatModal from "./CreateChatModal";
import { useState } from "react";

type Props = {
  username: string | undefined;
};

const UserDropdownMenu = ({ username }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
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
