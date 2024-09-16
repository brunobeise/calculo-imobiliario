import { notify } from "@/notify";
import { api } from "./api";
import { UserData } from "@/pages/UserConfig";

export const userService = {
  async getUserData() {
    try {
      const response = await api.get("/user-data");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.data.authError) {
        localStorage.removeItem("token");
        window.location.reload();
      }
      notify("error", error.response.data.error);
      throw new Error("Failed to get User Data: " + (error as Error).message);
    }
  },

  async editUser(userId: string, data: UserData) {
    try {
      const response = await api.put("/users/" + userId, data);
        notify("success", "Dados atualizados com sucesso!");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.data.authError) {
        localStorage.removeItem("token");
        window.location.reload();
      }
      notify("error", error.response.data.error);
      throw new Error("Failed to get User Data: " + (error as Error).message);
    }
  },
};
