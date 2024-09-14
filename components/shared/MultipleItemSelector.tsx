import { useSearchUsersToCreateChat } from "@/hooks/react-query";
import { CreateChat } from "@/lib/validations";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

type Props = {
  value: number[] | undefined;
  setValue: UseFormSetValue<CreateChat>;
};

const MultipleItemSelector = ({ value, setValue }: Props) => {
  const { data: users } = useSearchUsersToCreateChat();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  return (
    <div>
      {users?.data?.users.map((user) => (
        <div key={user.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={user.id.toString()}
            checked={value?.includes(user.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setValue("users", [...(value || []), user.id]);
                setSelectedUsers([...selectedUsers, user.name]);
              } else {
                setValue(
                  "users",
                  value ? value.filter((id) => id !== user.id) : []
                );
                setSelectedUsers(
                  selectedUsers.filter((name) => name !== user.name)
                );
              }
            }}
          />
          <label htmlFor={user.id.toString()}>{user.name}</label>
        </div>
      ))}
    </div>
  );
};

export default MultipleItemSelector;
