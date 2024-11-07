import { notify } from "@/notify";
import { api } from "./api";
import Cookies from "js-cookie";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  isFirstAccess: boolean;
}

export const loginService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      Cookies.set("token", response.data.token, { expires: 3650 });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.error);

      notify("error", error.response.data.error);
      throw new Error("Failed to login: " + (error as Error).message);
    }
  },

  async setPassword(email: string, newPassword: string) {
    try {
      const response = await api.post("/auth/set-password", {
        email,
        newPassword,
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify("error", error.response.data.error);
      throw new Error(error.response?.data?.error || "Falha ao resetar senha");
    }
  },

  async resetPassword(email: string) {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
      });

      notify("info", "Email com o código enviado para " + email);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify("error", error.response.data.error);
      throw new Error(error.response?.data?.error || "Falha ao resetar senha");
    }
  },

  async verifyCode(email: string, code: string) {
    try {
      const response = await api.post("/auth/verify-code", {
        email,
        code,
      });
      return response.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify("error", error.response.data.error);
      throw new Error(error.response?.data?.error || "Falha ao resetar senha");
    }
  },
};
