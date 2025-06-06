import { PropertyData } from "@/propertyData/PropertyDataContext";
import { User } from "./userTypes";
import { Session } from "./sessionTypes";
import { ReportConfig } from "./reportConfigTypes";

export interface Proposal {
  id: string;
  name: string;
  userId: string;
  propertyData: PropertyData;
  type: string;
  createdAt: Date;
  shared: boolean;
  status: string;
  propertyName?: string;
  propertyNameFont?: string;
  mainPhoto?: string;
  description?: string;
  subtitle: string;
  additionalPhotos: string[];
  features: string[];
  suites?: string;
  bathrooms?: string;
  bedrooms: string;
  parkingSpaces?: string;
  builtArea?: string;
  landArea?: string;
  address?: string;
  cod?: string;
  value?: number;
  subType: string;
  user: User;
  isArchived: boolean;
  sessions?: Session[];
  buildingId?: string;
  reportConfig?: ReportConfig;
  _count: {
    sessions: number;
  };
  hasNewSession: boolean;
}

export enum ProposalTypes {
  ParcelamentoDireto = "directFinancing",
  FinancamentoBancário = "financingPlanning",
}
