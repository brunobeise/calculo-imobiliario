/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /store/buildings/buildingsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { buildingService } from "@/service/buildingService";
import { Building } from "@/types/buildingTypes";
import { PaginatedResult } from "./store";
import { FetchBuildingsParams } from "@/types/paramsTypes";

interface BuildingsState {
  buildings: Building[];
  building: Building | undefined;
  lastPage: number | undefined;

  loading: boolean;
  createBuildingLoading: boolean;
  error: string | null;
}

const initialState: BuildingsState = {
  buildings: [],
  building: undefined,
  lastPage: undefined,
  loading: false,
  createBuildingLoading: false,
  error: null,
};

export const fetchBuildings = createAsyncThunk<
  PaginatedResult<Building> | undefined,
  FetchBuildingsParams | undefined
>("buildings/fetchBuildings", async (params = {}, { rejectWithValue }) => {
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
    const response = await buildingService.getAllBuildings(queryString);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchBuildingById = createAsyncThunk<Building | undefined, string>(
  "buildings/fetchBuildingById",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await buildingService.getBuildingById(buildingId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const createBuilding = createAsyncThunk<
  Building | undefined,
  Partial<Building>
>("buildings/createBuilding", async (data, { rejectWithValue }) => {
  try {
    const response = await buildingService.createBuilding(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const updateBuilding = createAsyncThunk<
  Building | undefined,
  { buildingId: string; data: Partial<Building> }
>(
  "buildings/updateBuilding",
  async ({ buildingId, data }, { rejectWithValue }) => {
    try {
      const { creator, ...filteredData } = data;

      const response = await buildingService.updateBuilding(
        buildingId,
        filteredData
      );
      if (!data.isArchived) return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const buildingsSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBuildings.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedResult<Building> | undefined>
        ) => {
          state.buildings = action.payload?.data || [];
          state.lastPage = action.payload?.meta.lastPage;
          state.loading = false;
        }
      )
      .addCase(fetchBuildings.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchBuildingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBuildingById.fulfilled,
        (state, action: PayloadAction<Building | undefined>) => {
          state.building = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        fetchBuildingById.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(createBuilding.pending, (state) => {
        state.createBuildingLoading = true;
        state.error = null;
      })
      .addCase(
        createBuilding.fulfilled,
        (state, action: PayloadAction<Building | undefined>) => {
          state.building = action.payload;
          state.createBuildingLoading = false;
        }
      )
      .addCase(createBuilding.rejected, (state, action: PayloadAction<any>) => {
        state.createBuildingLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateBuilding.pending, (state) => {
        state.createBuildingLoading = true;
        state.error = null;
      })
      .addCase(
        updateBuilding.fulfilled,
        (state, action: PayloadAction<Building | undefined>) => {
          state.building = action.payload;
          state.createBuildingLoading = false;
        }
      )
      .addCase(updateBuilding.rejected, (state, action: PayloadAction<any>) => {
        state.createBuildingLoading = false;
        state.error = action.payload;
      });
  },
});

export default buildingsSlice.reducer;
