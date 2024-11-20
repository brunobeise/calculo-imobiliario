export interface RealEstate {
  id?: string;
  name: string;
  address: string;
  logo?: string;
  logo2?: string;
  createdAt: Date;
  updatedAt: Date;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  headerType: number;
}

export interface RealEstateFormData {
  name: string;
  address: string;
  logo: string;
  logo2: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  headerType: number;
}

export interface RealEstateSelectOption {
  id: string;
  name: string;
  logo: string;
}
