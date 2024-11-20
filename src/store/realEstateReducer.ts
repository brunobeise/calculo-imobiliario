/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { realEstateService } from "@/service/realEstateService";
import { RealEstate, RealEstateSelectOption } from "@/types/realEstateTypes";
import { User, UserSelectOption } from "@/types/userTypes";

interface RealEstateState {
  realEstateData: RealEstate | undefined;
  realEstateSelectOptions: RealEstateSelectOption[];
  realEstateSelectOptionsLoading: boolean;
  realEstateUsersSelectOptions: UserSelectOption[];
  realEstateUsersSelectOptionsLoading: boolean;
  realEstateUsers: User[];
  realEstateUsersLoading: boolean;
  loading: boolean;
  error: string | undefined;
}

const initialState: RealEstateState = {
  realEstateData: undefined,
  realEstateSelectOptions: [],
  realEstateSelectOptionsLoading: false,
  realEstateUsersSelectOptions: [],
  realEstateUsersSelectOptionsLoading: false,
  realEstateUsers: [],
  realEstateUsersLoading: false,
  loading: false,
  error: undefined,
};

export const fetchRealEstateData = createAsyncThunk<
  RealEstate | undefined,
  void,
  { rejectValue: string }
>("realEstate/fetchRealEstateData", async (_, { rejectWithValue }) => {
  try {
    const response = await realEstateService.getRealEstateData();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchRealEstateUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("realEstate/fetchRealEstateUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await realEstateService.getUsersByRealEstateId();
    return response || [];
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchRealEstateSelectOptions = createAsyncThunk<
  RealEstateSelectOption[],
  void,
  { rejectValue: string }
>("realEstate/fetchRealEstateSelectOptions", async (_, { rejectWithValue }) => {
  try {
    const response = await realEstateService.getRealEstateSelectOptions();
    return response || [];
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const fetchRealEstateUsersSelectOptions = createAsyncThunk<
  UserSelectOption[],
  string,
  { rejectValue: string }
>(
  "realEstate/fetchRealEstateUsersSelectOptions",
  async (realEstateId, { rejectWithValue }) => {
    try {
      const response = await realEstateService.getUsersByRealEstateId(
        realEstateId
      );
      return (
        response?.map((user) => {
          return {
            fullName: user.fullName!,
            id: user.id!,
            photo: user.photo!,
          };
        }) || []
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const editRealEstateData = createAsyncThunk<
  RealEstate | undefined,
  Partial<RealEstate>,
  { rejectValue: string }
>(
  "realEstate/editRealEstateData",
  async (realEstateData, { rejectWithValue }) => {
    if (!realEstateData.id) return;
    try {
      const response = await realEstateService.editRealEstate(
        realEstateData.id,
        realEstateData
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const realEstateSlice = createSlice({
  name: "realEstate",
  initialState,
  reducers: {
    setRealEstateData: (state, action: PayloadAction<RealEstate>) => {
      state.realEstateData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealEstateData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchRealEstateData.fulfilled,
        (state, action: PayloadAction<RealEstate | undefined>) => {
          state.realEstateData = action.payload;

          state.loading = false;
        }
      )

      .addCase(
        fetchRealEstateData.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Erro ao buscar dados da imobiliária";
        }
      );

    builder
      .addCase(fetchRealEstateUsers.pending, (state) => {
        state.realEstateUsersLoading = true;
      })
      .addCase(
        fetchRealEstateUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.realEstateUsersLoading = false;
          state.realEstateUsers = action.payload;
        }
      )
      .addCase(
        fetchRealEstateUsers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.realEstateUsersLoading = false;
          state.error = action.payload || "Erro ao buscar dados da imobiliária";
        }
      );

    builder
      .addCase(fetchRealEstateSelectOptions.pending, (state) => {
        state.realEstateSelectOptionsLoading = true;
      })
      .addCase(
        fetchRealEstateSelectOptions.fulfilled,
        (state, action: PayloadAction<RealEstateSelectOption[]>) => {
          state.realEstateSelectOptionsLoading = false;
          state.realEstateSelectOptions = action.payload;
        }
      )
      .addCase(
        fetchRealEstateSelectOptions.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.realEstateSelectOptionsLoading = false;
          state.error = action.payload || "Erro ao buscar dados da imobiliária";
        }
      );

    builder
      .addCase(fetchRealEstateUsersSelectOptions.pending, (state) => {
        state.realEstateUsersSelectOptionsLoading = true;
      })
      .addCase(
        fetchRealEstateUsersSelectOptions.fulfilled,
        (state, action: PayloadAction<UserSelectOption[]>) => {
          state.realEstateUsersSelectOptionsLoading = false;
          state.realEstateUsersSelectOptions = action.payload;
        }
      )
      .addCase(
        fetchRealEstateUsersSelectOptions.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.realEstateUsersSelectOptionsLoading = false;
          state.error = action.payload || "Erro ao buscar dados da imobiliária";
        }
      );

    builder
      .addCase(editRealEstateData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        editRealEstateData.fulfilled,
        (state, action: PayloadAction<RealEstate | undefined>) => {
          state.realEstateData = action.payload || state.realEstateData;
          state.loading = false;
        }
      )
      .addCase(
        editRealEstateData.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Erro ao editar dados da imobiliária";
        }
      );
  },
});

export const { setRealEstateData } = realEstateSlice.actions;

export default realEstateSlice.reducer;
