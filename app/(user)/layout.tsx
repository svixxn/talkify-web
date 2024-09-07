import { ChatContextProvider } from "@/components/shared/ChatContext";
import { UserContextProvider } from "@/components/shared/UserContext";
import { PropsWithChildren } from "react";

const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <UserContextProvider>
      <ChatContextProvider>{children}</ChatContextProvider>
    </UserContextProvider>
  );
};

export default UserLayout;
