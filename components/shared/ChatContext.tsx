"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import { authTokenName } from "@/utils/constants";
import { User } from "@/types";

export type ChatContext = {
  currentChatId: number | null;
  setCurrentChatId: (id: number | null) => void;
  setNewChat: (value: boolean) => void;
};

const ctx: ChatContext = {
  currentChatId: null,
  setCurrentChatId: () => {},
  setNewChat: () => {},
};

const ChatContext = createContext(ctx);

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [newChat, setNewChat] = useState(false);

  return (
    <ChatContext.Provider
      value={{ currentChatId, setCurrentChatId, setNewChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
