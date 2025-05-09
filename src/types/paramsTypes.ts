export interface FetchCasesParams {
  minDate?: string;
  maxDate?: string;
  search?: string;
  type?: string;
  sortDirection?: "asc" | "desc";
  currentPage?: number;
  orderBy?: string;
  limit?: number;
}

export interface FetchBuildingsParams {
  search?: string;
  category?: string;
  sortDirection?: "asc" | "desc";
  orderBy?: string;
  currentPage?: number;
  limit?: number;
}

export interface FetchRealEstateCasesParams {
  search?: string;
  type?: string;
  currentPage?: number;
  limit?: number;
  userId?: string;
}
