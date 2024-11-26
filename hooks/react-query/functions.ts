import { CreateChat } from "@/lib/validations";
import {
  Chat,
  ChatMessage,
  ChatParticipant,
  DefaultApiResponse,
  GeneralChatInfo,
  SignIn,
  SignUp,
  User,
} from "@/types";
import { API_BASE_URL, authTokenName } from "@/utils/constants";
import { getCookie } from "@/utils/general";
import axios, { AxiosError, AxiosResponse } from "axios";

type SearchUsersResponse = {
  message: string;
  users: { id: number; avatar: string; name: string }[];
};

type FetchChatInfoResponse = {
  message: string;
  chatInfo: {
    name: string;
    photo: string;
    isGroup: boolean;
    description: string;
  };
  participants: ChatParticipant[];
};

type CreateChatResponse = {
  message: string;
  chatId: number;
};

type UpdateChatResponse = {
  message: string;
  updatedChat: Chat;
};

type CreateUserResponse = {
  message: string;
  userId: number;
};

type SignInResponse = {
  message: string;
  token: string;
  userId: string;
  expiresIn: string;
};

type GetUserByIdResponse = {
  message: string;
  user: User;
};

// users
export const registerUser = async (
  data: Omit<SignUp, "confirmPassword">
): Promise<DefaultApiResponse<CreateUserResponse>> => {
  try {
    const res: AxiosResponse = await axios.post(`${API_BASE_URL}/users`, data);
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const loginUser = async (
  data: SignIn
): Promise<DefaultApiResponse<SignInResponse>> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/sign-in`, data);
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const searchUsers = async (
  searchValue: string
): Promise<DefaultApiResponse<SearchUsersResponse>> => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/users/search?s=${searchValue}`,
      {
        headers: {
          Authorization: "Bearer " + getCookie(authTokenName),
        },
      }
    );

    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const getUserById = async (
  userId: number
): Promise<DefaultApiResponse<GetUserByIdResponse>> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/${userId}`, {
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

//chats
export const getUserChats = async (
  searchValue: string
): Promise<DefaultApiResponse<GeneralChatInfo[]>> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/chats?s=${searchValue}`, {
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

export const searchUsersToCreateChat = async (): Promise<
  DefaultApiResponse<SearchUsersResponse>
> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/searchToCreateChat`, {
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

export const createChat = async (
  data: CreateChat
): Promise<DefaultApiResponse<CreateChatResponse>> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/chats`, data, {
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

export const deleteChat = async (
  chatId: number
): Promise<DefaultApiResponse<{ message: string }>> => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/chats/${chatId}`, {
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

export const sendChatMessage = async (data: {
  content: string;
  messageType: string;
  chatId: number;
}): Promise<DefaultApiResponse<{ message: string }>> => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/chats/${data.chatId}/messages`,
      {
        content: data.content,
        messageType: data.messageType,
      },
      {
        headers: {
          Authorization: "Bearer " + getCookie(authTokenName),
        },
      }
    );

    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const getChatMessages = async (
  chatId: number
): Promise<DefaultApiResponse<ChatMessage[]>> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/chats/${chatId}/messages`, {
      headers: {
        Authorization: "Bearer " + getCookie(authTokenName),
      },
    });

    return { data: res.data.messages };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const updateChat = async (data: {
  name?: string;
  description?: string;
  chatId: number;
}): Promise<DefaultApiResponse<UpdateChatResponse>> => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/chats/${data.chatId}`,
      {
        name: data.name,
        description: data.description,
      },
      {
        headers: {
          Authorization: "Bearer " + getCookie(authTokenName),
        },
      }
    );

    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const clearChatHistory = async (data: {
  chatId: number;
  forAll: boolean;
}): Promise<DefaultApiResponse<UpdateChatResponse>> => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/chats/${data.chatId}/clearHistory`,
      {
        deleteForAll: data.forAll,
      },
      {
        headers: {
          Authorization: "Bearer " + getCookie(authTokenName),
        },
      }
    );

    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};
