"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useSearchUsers,
  useSearchUsersToCreateChat,
} from "@/hooks/react-query";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CreateChat } from "@/lib/validations";
import { FormControl } from "../ui/form";

type Props = {
  // errors: FieldErrors<CreateChat>;
  value: number[] | undefined;
  setValue: UseFormSetValue<CreateChat>;
};

const SearchUsersInput = ({ value, setValue }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const { data: users } = useSearchUsersToCreateChat();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedValue || "Search people..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput placeholder="Search people..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users?.data?.users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={(name) => {
                    setValue("users", [user.id]);
                    setSelectedValue(name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 mr-2",
                      selectedValue === user.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex gap-2 flex-row items-center w-full">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name.slice(0, 2)}
                      />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <span>{user.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchUsersInput;
