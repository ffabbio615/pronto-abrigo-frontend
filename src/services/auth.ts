import { api } from "./api";
import { useAuthStore } from "../store/useAuthStore";

interface LoginData {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginData) => {
  const response = await api.post("/shelters/login", {
    email,
    password,
  });

  const { user, token } = response.data;

  // salva no zustand
  useAuthStore.getState().setAuth(user, token);

  return response.data;
};

export const logout = () => {
  useAuthStore.getState().logout();
};