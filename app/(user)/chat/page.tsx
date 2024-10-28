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
import { MessageSquareDiff, MessagesSquare } from "lucide-react";
import useScreenSize from "@/hooks/useScreenWidth";
import ChatEmptyState from "@/components/shared/ChatEmptyState";

const ChatPage = () => {
  const { user, isLoading: isUserLoading } = useUserContext();
  const { currentChatId } = useChatContext();
  const { screenSize } = useScreenSize();

  return (
    <div className="flex md:p-4 h-screen w-full bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ChatSideMenu isUserLoading={isUserLoading || false} user={user} />
        <ResizableHandle className="md:mr-4" />
        {currentChatId ? (
          <MainChatArea currentChatId={currentChatId} screenSize={screenSize} />
        ) : (
          <ResizablePanel
            defaultSize={70}
            className="px-4 hidden md:flex md:px-6 items-center justify-center rounded-xl"
          >
            {isUserLoading ? (
              <MainChatAreaLoader />
            ) : (
              <ChatEmptyState
                title="Start a conversation"
                icon={<MessagesSquare className="w-10 h-10 animate-pulse" />}
                description="Select a chat to start messaging or create a new chat if you don't have any."
              />
            )}
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default ChatPage;
