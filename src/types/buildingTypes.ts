export interface Building {
  id: string;
  propertyName: string;
  propertyNameFont?: string;
  category: string;
  mainPhoto?: string;
  description?: string;
  subtitle?: string;
  additionalPhotos?: string[];
  features?: string[];
  bedrooms?: string;
  suites?: string;
  bathrooms?: string;
  parkingSpaces?: string;
  builtArea?: string;
  landArea?: string;
  address?: string;
  cod?: string;
  createdAt?: string;
  isArchived: boolean;
  value?: number;
  creator?: {
    fullName: string;
    id: string;
    photo: string;
  };
}
