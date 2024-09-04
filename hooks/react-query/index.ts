import { useMutation, useQuery } from "react-query";
import { getUserChats, loginUser, registerUser } from "./functions";
import { GeneralChatInfo, SignIn, SignUp } from "@/types";

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: Omit<SignUp, "confirmPassword">) => registerUser(data),
  });
};

export const useFetchUserChats = (userId: number) => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getUserChats,
  });
};
