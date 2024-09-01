import { useMutation, useQuery } from "react-query";
import { loginUser, registerUser } from "./functions";
import { SignIn, SignUp } from "@/types";

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: Omit<SignUp, "confirmPassword">) => registerUser(data),
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ["signin"],
    mutationFn: (data: SignIn) => loginUser(data),
  });
};
