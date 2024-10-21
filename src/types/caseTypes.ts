import { PropertyData } from "@/propertyData/PropertyDataContext";
import { User } from "./userTypes";

export interface CaseStudy {
  id: string;
  name: string;
  userId: string;
  propertyData: PropertyData;
  type: string;
  createdAt: Date;
  shared: boolean;
  propertyName?: string;
  mainPhoto?: string;
  description?: string;
  additionalPhotos: string[];
  features: string[];
  user: User;
}
