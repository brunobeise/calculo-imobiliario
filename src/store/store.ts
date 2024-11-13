// /store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "./caseReducer";
import userReducer from "./userReducer";
import realEstateReducer from "./realEstateReducer";
import adminDashboardReducer from "./dashboard/adminDashboardReducer";
import ownerDashboardReducer from './dashboard/ownerDashboardReducer'
import userDashboardReducer from "./dashboard/userDashboardReducer";

export const store = configureStore({
  reducer: {
    userDashboard: userDashboardReducer,
    ownerDashboard: ownerDashboardReducer,
    adminDashboard: adminDashboardReducer,
    cases: casesReducer,
    user: userReducer,
    realEstate: realEstateReducer,
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
