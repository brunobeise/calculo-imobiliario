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
  proposalsChart: { values: number[]; labels: string[] };
  proposalChartLoading: boolean;
  proposalTypeChart: { values: number[]; labels: string[] };
  proposalTypeChartLoading: boolean;
  proposalSubTypeChart: { values: number[]; labels: string[] };
  proposalSubTypeChartLoading: boolean;
  loading: boolean;
  error?: string;
}

const initialState: UserDashboardState = {
  inProgressProposals: undefined,
  totalProposals: undefined,
  acceptedProposals: undefined,
  lastSessions: [],
  lastSessionsLoading: false,
  proposalsChart: { values: [], labels: [] },
  proposalChartLoading: false,
  proposalTypeChart: { values: [], labels: [] },
  proposalTypeChartLoading: false,
  proposalSubTypeChart: { values: [], labels: [] },
  proposalSubTypeChartLoading: false,
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
>("userDashboard/fetchDashboardData", async (userId, { rejectWithValue }) => {
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
>("userDashboard/fetchLastSessions", async (userId, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getUserLastSessions(userId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchUserProposalsChart = createAsyncThunk<
  { values: number[]; labels: string[] },
  { filter: string; userId: string | undefined },
  { rejectValue: string }
>("userDashboard/fetchProposalsChart", async (props, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getUserProposalsChart(
      props.filter,
      props.userId
    );
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchUserProposalsTypeChart = createAsyncThunk<
  { values: number[]; labels: string[] },
  { filter: string; userId: string | undefined },
  { rejectValue: string }
>(
  "userDashboard/fetchUserProposalsTypeChart",
  async (props, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getUserProposalsTypeChart(
        props.filter,
        props.userId
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const fetchUserProposalsSubTypeChart = createAsyncThunk<
  { values: number[]; labels: string[] },
  { filter: string; userId: string | undefined },
  { rejectValue: string }
>(
  "userDashboard/fetchUserProposalsSubTypeChart",
  async (props, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getUserProposalsSubTypeChart(
        props.filter,
        props.userId
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const userDashboardSlice = createSlice({
  name: "userDashboard",
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

    builder
      .addCase(fetchUserProposalsChart.pending, (state) => {
        state.proposalChartLoading = true;
      })
      .addCase(
        fetchUserProposalsChart.fulfilled,
        (
          state,
          action: PayloadAction<{ values: number[]; labels: string[] }>
        ) => {
          state.proposalsChart = action.payload;
          state.proposalChartLoading = false;
        }
      )
      .addCase(fetchUserProposalsChart.rejected, (state, action) => {
        state.proposalChartLoading = false;
        state.error = action.payload || "Erro ao buscar gráfico de propostas";
      });

    builder
      .addCase(fetchUserProposalsTypeChart.pending, (state) => {
        state.proposalTypeChartLoading = true;
      })
      .addCase(
        fetchUserProposalsTypeChart.fulfilled,
        (
          state,
          action: PayloadAction<{ values: number[]; labels: string[] }>
        ) => {
          state.proposalTypeChart = action.payload;
          state.proposalTypeChartLoading = false;
        }
      )
      .addCase(fetchUserProposalsTypeChart.rejected, (state, action) => {
        state.proposalTypeChartLoading = false;
        state.error = action.payload || "Erro ao buscar gráfico de propostas";
      });

    builder
      .addCase(fetchUserProposalsSubTypeChart.pending, (state) => {
        state.proposalSubTypeChartLoading = true;
      })
      .addCase(
        fetchUserProposalsSubTypeChart.fulfilled,
        (
          state,
          action: PayloadAction<{ values: number[]; labels: string[] }>
        ) => {
          state.proposalSubTypeChart = action.payload;
          state.proposalSubTypeChartLoading = false;
        }
      )
      .addCase(fetchUserProposalsSubTypeChart.rejected, (state, action) => {
        state.proposalSubTypeChartLoading = false;
        state.error = action.payload || "Erro ao buscar gráfico de propostas";
      });
  },
});

export default userDashboardSlice.reducer;
