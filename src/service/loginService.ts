import { notify } from "@/App";
import { api } from "./api"; // Importa a instância do Axios que criamos

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

      localStorage.setItem("token", response.data.token);
      console.log(response.data);

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.error);

      notify("error", error.response.data.error);
      throw new Error("Failed to login: " + (error as Error).message);
    }
  },

  async setPassword(userId: string, newPassword: string) {
    try {
      const response = await api.post("/auth/set-password", {
        userId,
        newPassword,
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify("error", error.response.data.error);
      throw new Error(error.response?.data?.error || "Failed to set password");
    }
  },

  logout() {
    localStorage.removeItem("token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
