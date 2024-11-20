
import { Proposal } from "./proposalTypes";
import { RealEstate } from "./realEstateTypes";

export interface User {
  id?: string;
  fullName: string;
  role: string;
  creci?: string;
  address?: string;
  photo?: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  email: string;
  password?: string;
  owner: boolean;
  realEstateId: string;
  realEstate?: RealEstate;
  createdAt: Date;
  updatedAt: Date;
  cases?: Proposal[];
  casesCount?: number;
}

export interface UserSelectOption {
  id: string;
  fullName: string;
  photo: string;
}
