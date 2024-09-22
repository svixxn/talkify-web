import { ChatContextProvider } from "@/components/shared/ChatContext";
import { SocketProvider } from "@/components/shared/SocketProvider";
import { UserContextProvider } from "@/components/shared/UserContext";
import { API_BASE_URL } from "@/utils/constants";
import { PropsWithChildren } from "react";
const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <UserContextProvider>
      <SocketProvider url={API_BASE_URL}>
        <ChatContextProvider>{children}</ChatContextProvider>
      </SocketProvider>
    </UserContextProvider>
  );
};

export default UserLayout;
