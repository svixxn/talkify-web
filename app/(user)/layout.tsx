import { ChatContextProvider } from "@/components/shared/ChatContext";
import { SocketProvider } from "@/components/shared/SocketProvider";
import { UserContextProvider } from "@/components/shared/UserContext";
import { API_BASE_URL, WS_BASE_URL } from "@/utils/constants";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Talkify - User Dashboard",
  description: "User dashboard for managing chats and settings.",
};

const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <UserContextProvider>
      <SocketProvider url={WS_BASE_URL}>
        <ChatContextProvider>{children}</ChatContextProvider>
      </SocketProvider>
    </UserContextProvider>
  );
};

export default UserLayout;
