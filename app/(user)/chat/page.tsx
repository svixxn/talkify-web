"use client";

import ChatSideMenu from "@/components/chats/ChatSideMenu";
import { useUserContext } from "@/components/shared/UserContext";
import { useChatContext } from "@/components/shared/ChatContext";
import MainChatArea from "@/components/chats/MainChatArea";
import MainChatAreaLoader from "@/components/chats/MainChatAreaLoader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessageSquareDiff } from "lucide-react";
import useScreenSize from "@/hooks/useScreenWidth";

const ChatPage = () => {
  const { user, isLoading: isUserLoading } = useUserContext();
  const { currentChatId } = useChatContext();
  const { screenSize } = useScreenSize();

  return (
    <div className="flex h-screen w-full bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ChatSideMenu isUserLoading={isUserLoading || false} user={user} />
        <ResizableHandle />
        {currentChatId ? (
          <MainChatArea currentChatId={currentChatId} screenSize={screenSize} />
        ) : (
          <ResizablePanel
            defaultSize={70}
            className="px-4 hidden md:flex md:px-6 items-center justify-center"
          >
            {isUserLoading ? (
              <MainChatAreaLoader />
            ) : (
              <div className="flex flex-col gap-2 items-center">
                <span className="text-2xl font-semibold">
                  Choose the chat to start messaging
                </span>
                <span className="flex gap-2 items-center">
                  Or create a new one if you don&apos;t have any
                  <MessageSquareDiff className="h-6 w-6" />
                </span>
              </div>
            )}
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default ChatPage;
