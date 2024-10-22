/* eslint-disable @typescript-eslint/no-explicit-any */
import { notify } from "@/notify";
import { api } from "./api";
import { handleApiError } from "./errorHandler";
import { CaseStudy } from "@/types/caseTypes";


export const caseService = {
  async createCase(data: Partial<CaseStudy>) {
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

  async getAllProposals() {
    try {
      const response = await api.get<string[]>("/all-proposals");
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

  async getCaseToProposal(caseId: string) {
    try {
      const response = await api.get<CaseStudy>("/proposal-case/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar o case.");
    }
  },

  async updateCase(caseId: string, data: Partial<CaseStudy>) {
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
