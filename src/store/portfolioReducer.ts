/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { portfolioService } from "@/service/portfolioService";
import { Portfolio, PortfolioItem } from "@/types/portfolioTypes";
import { PaginatedResult } from "@/store/store";

interface PortfolioState {
  portfolios: PaginatedResult<Portfolio> | null;
  selectedPortfolio: Portfolio | null;
  loading: boolean;
  error: string | undefined;
  sessionLoading: boolean;
}

const initialState: PortfolioState = {
  portfolios: null,
  selectedPortfolio: null,
  loading: false,
  error: undefined,
  sessionLoading: false,
};

export const fetchPortfolioSessions = createAsyncThunk<
  { portfolioId: string; sessions: any[] },
  string,
  { rejectValue: string }
>("portfolio/fetchSessions", async (portfolioId, { rejectWithValue }) => {
  try {
    const sessions = await portfolioService.getSessionsByPortfolio(portfolioId);
    return { portfolioId, sessions };
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchPortfolios = createAsyncThunk<
  PaginatedResult<Portfolio>,
  string,
  { rejectValue: string }
>("portfolio/fetchAll", async (queryString, { rejectWithValue }) => {
  try {
    return await portfolioService.getAllPortfolios(queryString);
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchPortfolioById = createAsyncThunk<
  Portfolio,
  string,
  { rejectValue: string }
>("portfolio/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await portfolioService.getPortfolioById(id);
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const createPortfolio = createAsyncThunk<
  Portfolio,
  Partial<Portfolio>,
  { rejectValue: string }
>("portfolio/create", async (data, { rejectWithValue }) => {
  try {
    return await portfolioService.createPortfolio(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const updatePortfolio = createAsyncThunk<
  Portfolio,
  { id: string; data: Partial<Portfolio> },
  { rejectValue: string }
>("portfolio/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await portfolioService.updatePortfolio(id, data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const addItemToPortfolio = createAsyncThunk<
  PortfolioItem,
  { portfolioId: string; caseId?: string; buildingId?: string },
  { rejectValue: string }
>(
  "portfolio/addItem",
  async ({ portfolioId, caseId, buildingId }, { rejectWithValue }) => {
    try {
      if (caseId)
        return await portfolioService.addCaseToPortfolio(portfolioId, caseId);
      if (buildingId)
        return await portfolioService.addBuildingToPortfolio(
          portfolioId,
          buildingId
        );
      throw new Error("É necessário fornecer caseId ou buildingId");
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const removeItemFromPortfolio = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("portfolio/removeItem", async (itemId, { rejectWithValue }) => {
  try {
    return await portfolioService.removeItem(itemId);
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

// Slice
export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    clearSelectedPortfolio(state) {
      state.selectedPortfolio = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = action.payload;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchPortfolioById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPortfolioById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPortfolio = action.payload;
      })
      .addCase(fetchPortfolioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(createPortfolio.fulfilled, (state, action) => {
      state.portfolios?.data.unshift(action.payload);
    });

    builder.addCase(updatePortfolio.fulfilled, (state, action) => {
      if (state.selectedPortfolio?.id === action.payload.id) {
        state.selectedPortfolio = action.payload;
      }
    });

    builder.addCase(addItemToPortfolio.fulfilled, (state, action) => {
      state.selectedPortfolio?.items.push(action.payload);
    });

    builder.addCase(removeItemFromPortfolio.fulfilled, (state, action) => {
      if (state.selectedPortfolio) {
        state.selectedPortfolio.items = state.selectedPortfolio.items.filter(
          (item) => item.id !== action.meta.arg
        );
      }
    });

    builder
      .addCase(fetchPortfolioSessions.pending, (state) => {
        state.sessionLoading = true;
      })
      .addCase(fetchPortfolioSessions.fulfilled, (state, action) => {
        state.sessionLoading = false;
        const { portfolioId, sessions } = action.payload;
        const portfolio = state.portfolios?.data.find(
          (p) => p.id === portfolioId
        );
        if (portfolio) {
          (portfolio as any).sessions = sessions;
        }
      })
      .addCase(fetchPortfolioSessions.rejected, (state) => {
        state.sessionLoading = false;
      });
  },
});

export const { clearSelectedPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;
