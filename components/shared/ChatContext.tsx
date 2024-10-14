"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import { authTokenName } from "@/utils/constants";
import { User } from "@/types";

export type ChatContext = {
  currentChatId: number | null;
  setCurrentChatId: (id: number | null) => void;
  hasJoinedChats: boolean;
  setHasJoinedChats: (value: boolean) => void;
};

const ctx: ChatContext = {
  currentChatId: null,
  setCurrentChatId: () => {},
  hasJoinedChats: false,
  setHasJoinedChats: () => {},
};

const ChatContext = createContext(ctx);

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [hasJoinedChats, setHasJoinedChats] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        currentChatId,
        setCurrentChatId,
        setHasJoinedChats,
        hasJoinedChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
