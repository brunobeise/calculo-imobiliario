/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardService } from "@/service/dashboardService";

interface OwnerDashboardState {
  totalProposals: number;
  activeUsers: number;
  acceptedProposals: number;
  proposalsChart: { values: number[]; labels: string[] };
  featuredUsers: {
    title: string;
    photo: string;
    value: number;
  }[];
  featuredUsersLoading: boolean;
  loading: boolean;
  error: string | undefined;
}

const initialState: OwnerDashboardState = {
  totalProposals: 0,
  activeUsers: 0,
  acceptedProposals: 0,
  proposalsChart: { values: [], labels: [] },
  featuredUsers: [],
  featuredUsersLoading: false,
  loading: false,
  error: undefined,
};

export const fetchOwnerDashboardData = createAsyncThunk<
  {
    totalProposals: number;
    activeUsers: number;
    acceptedProposals: number;
  },
  string | undefined,
  { rejectValue: string }
>(
  "ownerDashboard/fetchDashboardData",
  async (realEstate, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getOwnerDashboardData(realEstate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const fetchFeaturedUsers = createAsyncThunk<
  {
    title: string;
    photo: string;
    value: number;
  }[],
  string | undefined,
  { rejectValue: string }
>(
  "ownerDashboard/fetchFeaturedUsers",
  async (realEstate, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getOwnerFeaturedUsers(realEstate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const fetchOwnerProposalsChart = createAsyncThunk<
  { values: number[]; labels: string[] },
  { filter: string; realEstate: string | undefined },
  { rejectValue: string }
>("ownerDashboard/fetchProposalsChart", async (props, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getProposalsChart(
      props.filter,
      props.realEstate
    );
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const ownerDashboardSlice = createSlice({
  name: "ownerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchOwnerDashboardData.fulfilled,
        (
          state,
          action: PayloadAction<{
            totalProposals: number;
            activeUsers: number;
            acceptedProposals: number;
          }>
        ) => {
          state.totalProposals = action.payload.totalProposals;
          state.activeUsers = action.payload.activeUsers;
          state.acceptedProposals = action.payload.acceptedProposals;
          state.loading = false;
        }
      )
      .addCase(fetchOwnerDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Erro ao buscar dados do dashboard do proprietário";
      });

    builder
      .addCase(fetchFeaturedUsers.pending, (state) => {
        state.featuredUsersLoading = true;
      })
      .addCase(
        fetchFeaturedUsers.fulfilled,
        (
          state,
          action: PayloadAction<
            {
              title: string;
              photo: string;
              value: number;
            }[]
          >
        ) => {
          state.featuredUsers = action.payload;
          state.featuredUsersLoading = false;
        }
      )
      .addCase(fetchFeaturedUsers.rejected, (state, action) => {
        state.featuredUsersLoading = false;
        state.error = action.payload || "Erro ao buscar propostas recentes";
      });

    builder
      .addCase(fetchOwnerProposalsChart.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchOwnerProposalsChart.fulfilled,
        (
          state,
          action: PayloadAction<{ values: number[]; labels: string[] }>
        ) => {
          state.proposalsChart = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOwnerProposalsChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao buscar gráfico de propostas";
      });
  },
});

export default ownerDashboardSlice.reducer;
