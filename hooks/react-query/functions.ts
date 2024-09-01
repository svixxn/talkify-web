import { SignIn, SignUp } from "@/types";
import { API_BASE_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";

type DefaultApiResponse = {
  data?: any;
  error?: any;
};

export const registerUser = async (
  data: Omit<SignUp, "confirmPassword">
): Promise<DefaultApiResponse> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users`, data);
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};

export const loginUser = async (data: SignIn): Promise<DefaultApiResponse> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/sign-in`, data);
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError;
    return { error: error.response?.data };
  }
};
