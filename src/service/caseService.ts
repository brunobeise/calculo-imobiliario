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
      notify("success", "Proposta criada com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao criar proposta.");
    }
  },

  async duplicateCase(params: {
    id: string;
    propertyName: string;
    name: string;
  }) {
    try {
      const response = await api.post("/cases-duplicate", params);
      notify("success", "Proposta criada com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao criar proposta.");
    }
  },

  async getAllCases(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Proposal>>(
        "/cases?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar as propostas");
    }
  },

  async getAllCaseSessions(caseId: string) {
    try {
      const response = await api.get<Session[]>("/cases-sessions/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar as propostas.");
    }
  },

  async getAllProposals() {
    try {
      const response = await api.get<string[]>("/proposals");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar as propostas.");
    }
  },

  async getAllRealEstateCases(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Proposal>>(
        "/cases-by-real-estate?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar as propostas.");
    }
  },

  async getCaseById(caseId: string) {
    try {
      const response = await api.get<Proposal>("/cases/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar a proposta.");
    }
  },

  async getCaseToProposal(caseId: string) {
    try {
      const response = await api.get<Proposal>("/proposal-case/" + caseId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar a proposta.");
    }
  },

  async updateCase(caseId: string, data: Partial<Proposal>) {
    try {
      const response = await api.put("/cases/" + caseId, data);
      notify("success", "Proposta atualizada com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao atualizar a proposta.");
    }
  },

  async deleteCase(caseId: string) {
    try {
      await api.delete("/cases/" + caseId);
      notify("success", "Proposta deletada com sucesso!");
    } catch (error: any) {
      handleApiError(error, "Erro ao deletar a proposta.");
    }
  },

  async getAllAdminCases(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Proposal>>(
        "/admin/cases?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar as propostas.");
    }
  },
};
