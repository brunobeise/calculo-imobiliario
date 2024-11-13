import { User } from "./userTypes";

export interface RealEstate {
  id?: string;
  name: string;
  address: string;
  logo?: string;
  logo2?: string;
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RealEstateSelectOption {
  id: string;
  name: string;
  logo: string;
}
