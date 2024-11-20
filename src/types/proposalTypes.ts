import { PropertyData } from "@/propertyData/PropertyDataContext";
import { User } from "./userTypes";
import { Session } from "./sessionTypes";

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
  mainPhoto?: string;
  description?: string;
  additionalPhotos: string[];
  features: string[];
  suites?: string;
  bathrooms?: string;
  parkingSpaces?: string;
  builtArea?: string;
  landArea?: string;
  address?: string;
  cod?: string;
  subType: string;

  user: User;
  isArchived: boolean;
  sessions?: Session[];
  pageViewMap: boolean[];
}
