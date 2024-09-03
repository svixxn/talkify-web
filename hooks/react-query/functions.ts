import { GeneralChatInfo, SignIn, SignUp } from "@/types";
import { API_BASE_URL, authTokenName } from "@/utils/constants";
import { getCookie } from "@/utils/general";
import axios, { AxiosError } from "axios";

type FetchChatsResponse = {
  message: string;
  userChats: GeneralChatInfo[];
};

type DefaultApiResponse<T> = {
  data?: T;
  error?: any;
};

export const registerUser = async (
  data: Omit<SignUp, "confirmPassword">
): Promise<DefaultApiResponse<any>> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users`, data);
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const loginUser = async (
  data: SignIn
): Promise<DefaultApiResponse<any>> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/sign-in`, data);
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const getUserChats = async (): Promise<
  DefaultApiResponse<FetchChatsResponse>
> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/chats`, {
      headers: {
        Authorization: "Bearer " + getCookie(authTokenName),
      },
    });
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};
