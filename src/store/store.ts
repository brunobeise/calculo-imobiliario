// /store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "./caseReducer";

export const store = configureStore({
  reducer: {
    cases: casesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
