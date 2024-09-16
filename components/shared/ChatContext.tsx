"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import { authTokenName } from "@/utils/constants";
import { User } from "@/types";

export type ChatContext = {
  currentChatId: number | null;
  setCurrentChatId: (id: number | null) => void;
};

const ctx: ChatContext = {
  currentChatId: null,
  setCurrentChatId: () => {},
};

const ChatContext = createContext(ctx);

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  return (
    <ChatContext.Provider value={{ currentChatId, setCurrentChatId }}>
      {children}
    </ChatContext.Provider>
  );
};
