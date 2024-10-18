/* eslint-disable @typescript-eslint/no-explicit-any */
import { notify } from "@/notify";
import { api } from "./api";
import { handleApiError } from "./errorHandler";
import { PropertyData } from "@/propertyData/PropertyDataContext";

export interface CaseStudy {
  id?: string;
  name: string;
  propertyData: PropertyData;
  type: string;
  createdAt?: string;
  shared?: boolean;
  user?: {
    id: string;
    photo: string;
    fullName: string;
  };
}

export const caseService = {
  async createCase(data: CaseStudy) {
    try {
      const response = await api.post("/cases", data);
      notify("success", "Case criado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao criar case.");
    }
  },

  async getAllCases() {
    try {
      const response = await api.get<CaseStudy[]>("/cases");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os cases.");
    }
  },

  async getAllRealEstateCases() {
    try {
      const response = await api.get<CaseStudy[]>("/cases-by-real-estate");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os cases.");
    }
  },

  async getCaseById(caseId: string) {
    try {
      const response = await api.get<CaseStudy>("/cases/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar o case.");
    }
  },

  async updateCase(caseId: string, data: CaseStudy) {
    try {
      const response = await api.put("/cases/" + caseId, data);
      notify("success", "Case atualizado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao atualizar o case.");
    }
  },

  async deleteCase(caseId: string) {
    try {
      await api.delete("/cases/" + caseId);
      notify("success", "Case deletado com sucesso!");
    } catch (error: any) {
      handleApiError(error, "Erro ao deletar o case.");
    }
  },
};
