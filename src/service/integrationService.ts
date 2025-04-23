import { Building } from "@/types/buildingTypes";
import { api } from "./api";

export const integrationService = {
  async importSingleProperty(code: string) {
    const data = await api.post<{ item: Building }>(
      `/integration-single/${code}`
    );
    return data.data.item;
  },
};
