import { ChatContextProvider } from "@/components/shared/ChatContext";
import { SocketProvider } from "@/components/shared/SocketProvider";
import { UserContextProvider } from "@/components/shared/UserContext";
import { PropsWithChildren } from "react";
const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <UserContextProvider>
      <SocketProvider url="http://localhost:8000">
        <ChatContextProvider>{children}</ChatContextProvider>
      </SocketProvider>
    </UserContextProvider>
  );
};

export default UserLayout;
