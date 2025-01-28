/* eslint-disable @typescript-eslint/no-explicit-any */
import { notify } from "@/notify";
import { api } from "./api";
import { handleApiError } from "./errorHandler";
import { PaginatedResult } from "@/store/store";
import { Building } from "@/types/buildingTypes";

export const buildingService = {
  async createBuilding(data: Partial<Building>) {
    try {
      const response = await api.post<Building>("/buildings", data);
      notify("success", "Imóvel criado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao criar imóvel.");
    }
  },

  async getAllBuildings(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Building>>(
        "/buildings?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os imóveis.");
    }
  },

  async getBuildingById(buildingId: string) {
    try {
      const response = await api.get<Building>("/buildings/" + buildingId);
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar o imóvel.");
    }
  },

  async updateBuilding(buildingId: string, data: Partial<Building>) {
    try {
      const response = await api.put("/buildings/" + buildingId, data);
      notify("success", "Imóvel atualizado com sucesso!");
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Erro ao atualizar o imóvel.");
    }
  },

  async deleteBuilding(buildingId: string) {
    try {
      await api.delete("/buildings/" + buildingId);
      notify("success", "Imóvel deletado com sucesso!");
    } catch (error: any) {
      handleApiError(error, "Erro ao deletar o imóvel.");
    }
  },

  async getAllAdminBuildings(queryString: string) {
    try {
      const response = await api.get<PaginatedResult<Building>>(
        "/admin/buildings?" + queryString
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, "Não foi possível buscar os imóveis.");
    }
  },
};
