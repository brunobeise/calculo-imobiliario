// /store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "./caseReducer";

export const store = configureStore({
  reducer: {
    cases: casesReducer,
  },
});

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
