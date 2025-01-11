/* eslint-disable @typescript-eslint/no-explicit-any */
import { dashboardService } from "@/service/dashboardService";
import { Session } from "@/types/sessionTypes";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface UserDashboardState {
  inProgressProposals: number;
  totalProposals: number;
  acceptedProposals: number;
  lastSessions: Session[];
  lastSessionsLoading: boolean;
  loading: boolean;
  error?: string;
}

const initialState: UserDashboardState = {
  inProgressProposals: undefined,
  totalProposals: undefined,
  acceptedProposals: undefined,
  lastSessions: [],
  lastSessionsLoading: false,
  loading: false,
  error: undefined,
};

export const fetchUserDashboardData = createAsyncThunk<
  {
    inProgressProposals: number;
    totalProposals: number;
    acceptedProposals: number;
  },
  string | undefined,
  { rejectValue: string }
>("adminDashboard/fetchDashboardData", async (userId, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getUserDashboardData(userId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchLastSessions = createAsyncThunk<
  Session[],
  string | undefined,
  { rejectValue: string }
>("adminDashboard/fetchLastSessions", async (userId, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getUserLastSessions(userId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUserDashboardData.fulfilled,
        (
          state,
          action: PayloadAction<{
            inProgressProposals: number;
            totalProposals: number;
            acceptedProposals: number;
          }>
        ) => {
          state.inProgressProposals = action.payload.inProgressProposals;
          state.totalProposals = action.payload.totalProposals;
          state.acceptedProposals = action.payload.acceptedProposals;
          state.loading = false;
        }
      )
      .addCase(fetchUserDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao buscar dados do dashboard";
      });

    builder
      .addCase(fetchLastSessions.pending, (state) => {
        state.lastSessionsLoading = true;
      })
      .addCase(
        fetchLastSessions.fulfilled,
        (state, action: PayloadAction<Session[]>) => {
          state.lastSessions = action.payload;
          state.lastSessionsLoading = false;
        }
      )
      .addCase(fetchLastSessions.rejected, (state, action) => {
        state.lastSessionsLoading = false;
        state.error = action.payload || "Erro ao buscar dados do dashboard";
      });
  },
});

export default adminDashboardSlice.reducer;
