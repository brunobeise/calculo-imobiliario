// services/realEstateService.ts
import { notify } from "@/notify";
import { api } from "./api";
import { handleApiError } from "./errorHandler";
import {
  OnboardingDTO,
  RealEstate,
  RealEstateSelectOption,
} from "@/types/realEstateTypes";
import { User } from "@/types/userTypes";

export const realEstateService = {
  async createOnboarding(data: OnboardingDTO): Promise<boolean> {
    try {
      await api.post("/admin/onboarding", data);
      notify("success", "Onboarding finalziado com sucesso!");
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(
        error,
        "Não foi possível concluir o cadastro de onboarding."
      );
      return false;
    }
  },

  async getRealEstateData() {
    try {
      const response = await api.get("/realestate-data");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(error, "Não foi possível obter os dados da imobiliária.");
    }
  },

  async editRealEstate(realEstateId: string, data: Partial<RealEstate>) {
    try {
      const response = await api.put("/realestates/" + realEstateId, {
        ...data,
        users: undefined,
      });
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

  async getUsersByRealEstateId(realEstateId: string = "undefined") {
    try {
      const response = await api.get<User[]>(
        "/realestate-users/" + (realEstateId || "undefined")
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleApiError(
        error.response?.data?.error,
        "Não foi possível obter os usuários da imobiliária."
      );
    }
  },

  async getRealEstateSelectOptions() {
    try {
      const response = await api.get<RealEstateSelectOption[]>(`/realestates`);
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
