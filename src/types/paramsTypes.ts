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
