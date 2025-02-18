// dashboardService.ts

import { api } from "./api";

export const dashboardService = {
  async getAdminDashboardData() {
    const response = await api.get("/admin/dashboard-data");
    return response.data;
  },

  async getAdminFeaturedRealEstates() {
    const response = await api.get<
      {
        title: string;
        photo: string;
        value: number;
      }[]
    >("/admin/dashboard-featured-real-estates");
    return response.data;
  },

  async getAdminProposalsChart(filter: string) {
    const response = await api.get<{ values: number[]; labels: [] }>(
      "/admin/proposals-chart/" + filter
    );
    return response.data;
  },

  async getOwnerProposalsChart(filter: string, realEstateId?: string) {
    const response = await api.get<{ values: number[]; labels: [] }>(
      "/dashboard/proposals-chart/" +
        filter +
        "/" +
        (realEstateId || "undefined")
    );
    return response.data;
  },

  async getUserProposalsChart(filter: string, userId: string) {
    const response = await api.get<{ values: number[]; labels: [] }>(
      "/dashboard/proposals-chart/" + filter + "/" + userId
    );
    return response.data;
  },

  async getOwnerProposalsTypeChart(filter: string, realEstateId?: string) {
    const response = await api.get<{ values: number[]; labels: [] }>(
      "/dashboard/proposals-type-chart/" +
        filter +
        "/" +
        (realEstateId || "undefined")
    );
    return response.data;
  },

  async getUserProposalsTypeChart(filter: string, userId: string) {
    const response = await api.get<{ values: number[]; labels: [] }>(
      "/dashboard/proposals-type-chart/" + filter + "/" + userId
    );
    return response.data;
  },

  async getOwnerProposalsSubTypeChart(filter: string, realEstateId?: string) {
    const response = await api.get<{ values: number[]; labels: [] }>(
      "/dashboard/proposals-sub-type-chart/" +
        filter +
        "/" +
        (realEstateId || "undefined")
    );
    return response.data;
  },

  async getUserProposalsSubTypeChart(filter: string, userId: string) {
    const response = await api.get<{ values: number[]; labels: [] }>(
      "/dashboard/proposals-sub-type-chart/" + filter + "/" + userId
    );
    return response.data;
  },

  async getOwnerDashboardData(realEstateId?: string) {
    const response = await api.get(
      "/dashboard/owner/" + (realEstateId || "undefined")
    );
    return response.data;
  },

  async getOwnerFeaturedUsers(realEstateId?: string) {
    const response = await api.get<
      {
        title: string;
        photo: string;
        value: number;
      }[]
    >("/dashboard/featured-users/" + (realEstateId || "undefined"));
    return response.data;
  },

  async getUserDashboardData(userId?: string) {
    const response = await api.get("/dashboard/user/" + userId);
    return response.data;
  },

  async getUserLastSessions(userId?: string) {
    const response = await api.get("/dashboard/last-sessions/" + userId);
    return response.data;
  },
};
