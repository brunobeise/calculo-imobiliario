import { notify } from "@/notify";
import { api } from "./api";
import { UserData } from "@/pages/UserConfig";
import { handleApiError } from "./errorHandler";

export const userService = {
  async getUserData() {
    try {
      const response = await api.get("/user-data");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(error.response?.data?.error, "Não foi possível buscar dados do usuário.");
    }
  },

  async editUser(userId: string, data: UserData) {
    try {
      const response = await api.put("/users/" + userId, data);
      notify("success", "Dados atualizados com sucesso!");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(error.response?.data?.error, "Erro ao atualizar usuário.");
    }
  },
};
