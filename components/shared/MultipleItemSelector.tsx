import {
  useSearchUsers,
  useSearchUsersToCreateChat,
} from "@/hooks/react-query";
import { CreateChat } from "@/lib/validations";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import SearchUsersInput from "../chats/SearchUsersInput";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormControl } from "../ui/form";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

type Props = {
  value: number[] | undefined;
  setValue: UseFormSetValue<CreateChat>;
};

const MultipleItemSelector = ({ value, setValue }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: users } = useSearchUsers("");

  console.log("users", users);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const searchUsers = users?.data?.users.filter(
    (user) => !selectedUsers.includes(user.name)
  );

  const handleRemoveUser = (name: string) => {
    if (!value) return;
    setValue(
      "users",
      value?.filter(
        (id) => id !== users?.data?.users.find((u) => u.name === name)?.id
      )
    );
    setSelectedUsers((prev) => prev.filter((n) => n !== name));
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-wrap gap-2 mb-2">
        {selectedUsers.map((name) => (
          <Badge key={name} onClick={() => handleRemoveUser(name)}>
            {name}
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              Search people...
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
                {searchUsers?.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onSelect={(name) => {
                      setValue(
                        "users",
                        value ? [...value, user.id] : [user.id]
                      );
                      setSelectedUsers((prev) => [...prev, name]);
                      setOpen(false);
                    }}
                  >
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
    </div>
  );
};

export default MultipleItemSelector;
