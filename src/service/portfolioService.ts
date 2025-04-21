/* eslint-disable @typescript-eslint/no-explicit-any */
import { notify } from "@/notify";
import { api } from "./api";
import { handleApiError } from "./errorHandler";

import { PaginatedResult } from "@/store/store";
import { Portfolio, PortfolioItem } from "@/types/portfolioTypes";

export const portfolioService = {
  async createPortfolio(data: Partial<Portfolio>) {
    try {
      const response = await api.post("/portfolios", data);
      notify("success", "Portfólio criado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao criar portfólio.");
    }
  },

  async updatePortfolio(id: string, data: Partial<Portfolio>) {
    try {
      const response = await api.put(`/portfolios/${id}`, data);
      notify("success", "Portfólio atualizado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao atualizar portfólio.");
    }
  },

  async deletePortfolio(id: string) {
    try {
      await api.delete(`/portfolios/${id}`);
      notify("success", "Portfólio deletado com sucesso!");
    } catch (error: any) {
      handleApiError(error, "Erro ao deletar portfólio.");
    }
  },

  async getAllPortfolios(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Portfolio>>(
        `/portfolios?${queryString}`
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao buscar portfólios.");
    }
  },

  async getSessionsByPortfolio(id: string) {
    try {
      const response = await api.get(`/portfolios-sessions/${id}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao buscar portfólios.");
    }
  },

  async getPortfolioById(id: string) {
    try {
      const response = await api.get<Portfolio>(`/portfolios/${id}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao buscar portfólio.");
    }
  },

  async getSharedPortfolio(id: string) {
    try {
      const response = await api.get<Portfolio>(`/portfolio-case/${id}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao buscar portfólio.");
    }
  },

  async addCaseToPortfolio(portfolioId: string, caseId: string) {
    try {
      const response = await api.post<PortfolioItem>(
        `/portfolios/${portfolioId}/case`,
        { caseId }
      );
      notify("success", "Proposta adicionada ao portfólio!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao adicionar proposta.");
    }
  },

  async addBuildingToPortfolio(portfolioId: string, buildingId: string) {
    try {
      const response = await api.post<PortfolioItem>(
        `/portfolios/${portfolioId}/building`,
        { buildingId }
      );
      notify("success", "Imóvel adicionado ao portfólio!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao adicionar imóvel.");
    }
  },

  async removeItem(itemId: string) {
    try {
      await api.delete(`/portfolio-item/${itemId}`);
      notify("success", "Item removido do portfólio!");
    } catch (error: any) {
      handleApiError(error, "Erro ao remover item do portfólio.");
    }
  },
};
