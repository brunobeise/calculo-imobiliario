import { PropertyData } from "@/propertyData/PropertyDataContext";
import { User } from "./userTypes";
import { Session } from "./sessionTypes";

export interface CaseStudy {
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
  user: User;
  isArchived: boolean;
  sessions?: Session[];
  pageViewMap: boolean[];
}
