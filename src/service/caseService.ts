/* eslint-disable @typescript-eslint/no-explicit-any */
import { notify } from "@/notify";
import { api } from "./api";
import { handleApiError } from "./errorHandler";
import { Proposal } from "@/types/proposalTypes";
import { Session } from "@/types/sessionTypes";
import { PaginatedResult } from "@/store/store";

export const caseService = {
  async createCase(data: Partial<Proposal>) {
    try {
      const response = await api.post("/cases", data);
      notify("success", "Estudo criado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao criar case.");
    }
  },

  async getAllCases(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Proposal>>(
        "/cases?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os cases.");
    }
  },

  async getAllCaseSessions(caseId: string) {
    try {
      const response = await api.get<Session[]>("/cases-sessions/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os cases.");
    }
  },

  async getAllProposals() {
    try {
      const response = await api.get<string[]>("/proposals");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os cases.");
    }
  },

  async getAllRealEstateCases(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Proposal>>(
        "/cases-by-real-estate?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os cases.");
    }
  },

  async getCaseById(caseId: string) {
    try {
      const response = await api.get<Proposal>("/cases/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar o case.");
    }
  },

  async getCaseToProposal(caseId: string) {
    try {
      const response = await api.get<Proposal>("/proposal-case/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar o case.");
    }
  },

  async updateCase(caseId: string, data: Partial<Proposal>) {
    try {
      const response = await api.put("/cases/" + caseId, data);
      notify("success", "Estudo atualizado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao atualizar o case.");
    }
  },

  async deleteCase(caseId: string) {
    try {
      await api.delete("/cases/" + caseId);
      notify("success", "Estudo deletado com sucesso!");
    } catch (error: any) {
      handleApiError(error, "Erro ao deletar o case.");
    }
  },

  async getAllAdminCases(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Proposal>>(
        "/admin/cases?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os cases.");
    }
  },
};
