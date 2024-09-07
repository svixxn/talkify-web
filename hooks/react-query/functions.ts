import { GeneralChatInfo, SignIn, SignUp } from "@/types";
import { API_BASE_URL, authTokenName } from "@/utils/constants";
import { getCookie } from "@/utils/general";
import axios, { AxiosError, AxiosResponse } from "axios";

type ChatMessage = {
  id: string;
  createdAt: Date;
  senderId: number;
  chatId: number;
  content: string;
  messageType: string;
};

type FetchChatsResponse = {
  message: string;
  userChats: GeneralChatInfo[];
};

type FetchChatInfoResponse = {
  message: string;
  chatInfo: { name: string };
  chatMessages: ChatMessage[];
};

type DefaultApiResponse<T> = {
  data?: T;
  error?: any;
};

export const registerUser = async (
  data: Omit<SignUp, "confirmPassword">
): Promise<DefaultApiResponse<any>> => {
  try {
    const res: AxiosResponse<FetchChatsResponse> = await axios.post(
      `${API_BASE_URL}/users`,
      data
    );
    return { data: res.data.userChats };
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
  DefaultApiResponse<GeneralChatInfo[]>
> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/chats`, {
      headers: {
        Authorization: "Bearer " + getCookie(authTokenName),
      },
    });

    return { data: res.data.userChats };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const getChatInfo = async (
  chatId: number
): Promise<DefaultApiResponse<FetchChatInfoResponse>> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/chats/${chatId}`, {
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
