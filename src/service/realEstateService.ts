// services/realEstateService.ts
import { notify } from "@/notify";
import { api } from "./api";
import { RealEstateData } from "@/pages/RealEstateConfig";
import { handleApiError } from "./errorHandler";

export const realEstateService = {
  async getRealEstateData() {
    try {
      const response = await api.get("/realestate-data");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(error, "Não foi possível obter os dados da imobiliária.");
    }
  },

  async editRealEstate(realEstateId: string, data: RealEstateData) {
    try {
      const response = await api.put("/realestates/" + realEstateId, data);
      notify("success", "Dados atualizados com sucesso!");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(
        error,
        "Não foi possível atualizar os dados da imobiliária."
      );
    }
  },

  async getUsersByRealEstateId(realEstateId: string) {
    try {
      const response = await api.get(`/realestates/${realEstateId}/users`);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(
        error.response?.data?.error,
        "Não foi possível obter os usuários da imobiliária."
      );
    }
  },
};
