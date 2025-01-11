/* eslint-disable @typescript-eslint/no-explicit-any */
import { dashboardService } from "@/service/dashboardService";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface AdminDashboardState {
  activeUsers: number;
  realEstateCount: number;
  totalProposals: number;
  proposalsChart: { values: number[]; labels: string[] };
  featuredRealEstates: {
    title: string;
    photo: string;
    value: number;
  }[];
  featuredRealEstatesLoading: boolean;
  loading: boolean;
  error: string | undefined;
}

const initialState: AdminDashboardState = {
  activeUsers: undefined,
  realEstateCount: undefined,
  totalProposals: undefined,
  proposalsChart: { values: [], labels: [] },
  featuredRealEstates: [],
  featuredRealEstatesLoading: false,
  loading: false,
  error: undefined,
};

export const fetchAdminDashboardData = createAsyncThunk<
  {
    activeUsers: number;
    realEstateCount: number;
    totalProposals: number;
    proposalsByMonth: { month: string; count: number }[];
  },
  void,
  { rejectValue: string }
>("adminDashboard/fetchDashboardData", async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getAdminDashboardData();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchFeaturedRealEstates = createAsyncThunk<
  {
    title: string;
    photo: string;
    value: number;
  }[],
  void,
  { rejectValue: string }
>("adminDashboard/fetchFeaturedRealEstates", async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getAdminFeaturedRealEstates();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchProposalsChart = createAsyncThunk<
  { values: number[]; labels: string[] },
  string,
  { rejectValue: string }
>("adminDashboard/fetchProposalsData", async (filter, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getProposalsChart(filter);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },
    setRealEstateCount: (state, action: PayloadAction<number>) => {
      state.realEstateCount = action.payload;
    },
    setTotalProposals: (state, action: PayloadAction<number>) => {
      state.totalProposals = action.payload;
    },
    setFeaturedRealEstates: (
      state,
      action: PayloadAction<
        {
          title: string;
          photo: string;
          value: number;
        }[]
      >
    ) => {
      state.featuredRealEstates = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAdminDashboardData.fulfilled,
        (
          state,
          action: PayloadAction<{
            activeUsers: number;
            realEstateCount: number;
            totalProposals: number;
            proposalsByMonth: { month: string; count: number }[];
          }>
        ) => {
          state.activeUsers = action.payload.activeUsers;
          state.realEstateCount = action.payload.realEstateCount;
          state.totalProposals = action.payload.totalProposals;
          state.loading = false;
        }
      )
      .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao buscar dados do dashboard";
      });

    builder
      .addCase(fetchFeaturedRealEstates.pending, (state) => {
        state.featuredRealEstatesLoading = true;
      })
      .addCase(
        fetchFeaturedRealEstates.fulfilled,
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
          state.featuredRealEstates = action.payload;
          state.featuredRealEstatesLoading = false;
        }
      )
      .addCase(fetchFeaturedRealEstates.rejected, (state, action) => {
        state.featuredRealEstatesLoading = false;
        state.error =
          action.payload || "Erro ao buscar imobiliárias em destaque";
      });

    builder
      .addCase(fetchProposalsChart.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProposalsChart.fulfilled,
        (
          state,
          action: PayloadAction<{ values: number[]; labels: string[] }>
        ) => {
          state.proposalsChart = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProposalsChart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Erro ao buscar imobiliárias em destaque";
      });
  },
});

export const {
  setActiveUsers,
  setRealEstateCount,
  setTotalProposals,
  setFeaturedRealEstates,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
