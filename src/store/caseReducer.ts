/* eslint-disable @typescript-eslint/no-explicit-any */
// /store/cases/casesSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { caseService } from "@/service/caseService";
import { CaseStudy } from "@/types/caseTypes";
import {
  FetchCasesParams,
  FetchRealEstateCasesParams,
} from "@/types/paramsTypes";
import { PaginatedResult } from "./store";
import { Session } from "@/types/sessionTypes";

// Define o estado inicial
interface CasesState {
  myCases: CaseStudy[];
  myCasesLastPage: number | undefined;
  realEstateCases: CaseStudy[];
  realEstateCasesLastPage: number | undefined;
  realEstateCasesLoading: boolean;
  myCasesLoading: boolean;
  sessionLoading: boolean;
  error: string | null;
}

const initialState: CasesState = {
  myCases: [],
  myCasesLastPage: undefined,
  realEstateCases: [],
  realEstateCasesLastPage: undefined,
  realEstateCasesLoading: false,
  myCasesLoading: false,
  sessionLoading: false,
  error: null,
};

export const fetchCases = createAsyncThunk<
  PaginatedResult<CaseStudy> | undefined,
  FetchCasesParams | undefined
>("cases/fetchCases", async (params = {}, { rejectWithValue }) => {
  try {
    const validParams = params || {};
    const queryString = new URLSearchParams(
      Object.entries(validParams).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const response = await caseService.getAllCases(queryString);

    if (response) {
      return response;
    } else {
      return undefined;
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});
export const fetchRealEstateCases = createAsyncThunk<
  PaginatedResult<CaseStudy> | undefined,
  FetchRealEstateCasesParams | undefined
>("cases/fetchRealEstateCases", async (params = {}, { rejectWithValue }) => {
  try {
    const validParams = params || {};
    const queryString = new URLSearchParams(
      Object.entries(validParams).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const response = await caseService.getAllRealEstateCases(queryString);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchCaseSessions = createAsyncThunk(
  "cases/fetchCaseSessions",
  async (caseId: string, { rejectWithValue }) => {
    try {
      const response = await caseService.getAllCaseSessions(caseId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const casesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.pending, (state) => {
        state.myCasesLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCases.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedResult<CaseStudy> | undefined>
        ) => {
          console.log(action.payload);

          state.myCases = action.payload?.data || [];
          state.myCasesLastPage = action.payload?.meta.lastPage;
          state.myCasesLoading = false;
        }
      )
      .addCase(fetchCases.rejected, (state, action: PayloadAction<any>) => {
        state.myCasesLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchRealEstateCases.pending, (state) => {
        state.realEstateCasesLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRealEstateCases.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedResult<CaseStudy> | undefined>
        ) => {
          state.realEstateCases = action.payload?.data || [];
          state.realEstateCasesLastPage = action.payload?.meta.lastPage;
          state.realEstateCasesLoading = false;
        }
      )
      .addCase(
        fetchRealEstateCases.rejected,
        (state, action: PayloadAction<any>) => {
          state.realEstateCasesLoading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(fetchCaseSessions.pending, (state) => {
        state.sessionLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCaseSessions.fulfilled,
        (state, action: PayloadAction<Session[] | undefined>) => {
          if (action.payload && action.payload.length > 0 && state.myCases) {
            state.myCases = state.myCases.map((c) => {
              if (c.id === action.payload![0].caseId) {
                return { ...c, sessions: action.payload };
              }
              return c;
            });
          }

          state.sessionLoading = false;
        }
      )
      .addCase(
        fetchCaseSessions.rejected,
        (state, action: PayloadAction<any>) => {
          state.sessionLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default casesSlice.reducer;
