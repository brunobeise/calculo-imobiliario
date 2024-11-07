/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { realEstateService } from "@/service/realEstateService";
import { RealEstate } from "@/types/realEstateTypes";
import { User } from "@/types/userTypes";

interface RealEstateState {
  realEstateData: RealEstate | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: RealEstateState = {
  realEstateData: undefined,
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

export const editRealEstateData = createAsyncThunk<
  RealEstate | undefined,
  RealEstate,
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
    addUser: (state, action: PayloadAction<User>) => {
      state.realEstateData?.users?.push(action.payload);
    },
    updateUserAdmin: (state, action: PayloadAction<string>) => {
      if (state.realEstateData?.users) {
        state.realEstateData.users = state.realEstateData.users.map((user) =>
          user.id === action.payload ? { ...user, owner: !user.owner } : user
        );
      }
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
          if (action.payload) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { users, ...otherData } = action.payload;

            state.realEstateData = {
              ...state.realEstateData,
              ...otherData,
            };
          }
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
        state.loading = true;
      })
      .addCase(
        fetchRealEstateUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.realEstateData = {
            ...state.realEstateData!,
            users: action.payload,
          };
        }
      )
      .addCase(
        fetchRealEstateUsers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
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

export const { setRealEstateData, addUser, updateUserAdmin } =
  realEstateSlice.actions;

export default realEstateSlice.reducer;
