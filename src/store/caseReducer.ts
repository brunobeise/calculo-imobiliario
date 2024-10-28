/* eslint-disable @typescript-eslint/no-explicit-any */
// /store/cases/casesSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { caseService } from "@/service/caseService";
import { CaseStudy } from "@/types/caseTypes";
import { Session } from "@/types/sessionTypes";

// Define o estado inicial
interface CasesState {
  cases: CaseStudy[];
  realEstateCases: CaseStudy[];
  loading: boolean;
  sessionLoading: boolean;
  error: string | null;
}

const initialState: CasesState = {
  cases: [],
  realEstateCases: [],
  loading: false,
  sessionLoading: false,
  error: null,
};

export const fetchCases = createAsyncThunk(
  "cases/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await caseService.getAllCases();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRealEstateCases = createAsyncThunk(
  "cases/fetchRealEstateCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await caseService.getAllRealEstateCases();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCases.fulfilled,
        (state, action: PayloadAction<CaseStudy[] | undefined>) => {
          state.cases = action.payload || [];
          state.loading = false;
        }
      )
      .addCase(fetchCases.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchRealEstateCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRealEstateCases.fulfilled,
        (state, action: PayloadAction<CaseStudy[] | undefined>) => {
          state.realEstateCases = action.payload || [];
          state.loading = false;
        }
      )
      .addCase(
        fetchRealEstateCases.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
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
          if (action.payload && action.payload.length > 0) {
            state.cases = state.cases.map((c) => {
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
