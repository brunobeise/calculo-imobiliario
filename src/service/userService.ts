/* eslint-disable @typescript-eslint/no-explicit-any */
import { notify } from "@/notify";
import { api } from "./api";
import { handleApiError } from "./errorHandler";
import { User } from "@/types/userTypes";

export const userService = {
  async getUserData() {
    try {
      const response = await api.get<User>("/user-data");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar dados do usuário.");
    }
  },

  async getUserPermissions() {
    const response = await api.get<{
      id: string;
      owner: boolean;
      admin: boolean;
      imobzi: boolean;
    }>("/permissions");
    return response.data;
  },

  async editUser(userId: string, data: Partial<User>) {
    try {
      const response = await api.put("/users/" + userId, data);
      notify("success", "Dados atualizados com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao atualizar usuário.");
    }
  },

  async createUser(data: Partial<User>) {
    try {
      const response = await api.post("/users", data);
      notify("success", "Usuário criado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao criar usuário.");
    }
  },
};
