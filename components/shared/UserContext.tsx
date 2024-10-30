"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import { API_BASE_URL, authTokenName } from "@/utils/constants";
import { User } from "@/types";

export type UserContext = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading?: boolean;
};

type FetchUserResponse = {
  message: string;
  user: User;
};

const ctx: UserContext = {
  user: null,
  setUser: () => {},
  isLoading: true,
};

const UserContext = createContext(ctx);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get(authTokenName);
      if (token) {
        try {
          const res: AxiosResponse<FetchUserResponse> = await axios.get(
            `${API_BASE_URL}/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(res.data.user);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
