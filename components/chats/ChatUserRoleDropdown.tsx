import { ChatRole } from "@/types";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { chatRoles } from "@/utils/allowedRoles";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useUpdateChatMember } from "@/hooks/react-query";
import { useToast } from "@/hooks/useToast";

type Props = {
  userRole: ChatRole;
  userId: number;
  chatId: number;
  setSelectedMembers: React.Dispatch<
    React.SetStateAction<{ id: number; role: ChatRole }[]>
  >;
};

const ChatUserRoleDropdown = ({
  userRole,
  userId,
  chatId,
  setSelectedMembers,
}: Props) => {
  const [value, setValue] = useState(userRole);

  const { mutateAsync: updateChatMemberAction, isLoading } =
    useUpdateChatMember(userId, chatId);
  const { toast } = useToast();

  const handleRoleChange = async (role: ChatRole) => {
    setValue(role);
    const res = await updateChatMemberAction({
      memberId: userId,
      chatId: chatId,
      data: { role },
    });

    if (res.error) {
      toast({
        title: res.error.message,
      });
      return;
    }

    toast({
      title: "Member updated successfully",
    });

    setSelectedMembers([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex flex-row gap-4">
          Change Role
          <ChevronsUpDown className="opacity-50" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {chatRoles.map((role) => (
                <CommandItem
                  disabled={isLoading}
                  key={role}
                  value={role}
                  onSelect={(currentValue) => {
                    handleRoleChange(currentValue as ChatRole);
                  }}
                >
                  {role}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === role ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ChatUserRoleDropdown;
