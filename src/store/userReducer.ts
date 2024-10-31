/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/service/userService";
import { User } from "@/types/userTypes";

interface UserState {
  userData: User | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: UserState = {
  userData: undefined,
  loading: false,
  error: undefined,
};
undefined;

// Thunk para buscar dados do usuário
export const fetchUserData = createAsyncThunk<
  User | undefined,
  void,
  { rejectValue: string }
>("user/fetchUserData", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getUserData();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});
export const editUserData = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>("user/editUserData", async (userData, { rejectWithValue }) => {
  try {
    if (!userData.id) return;
    const response = await userService.editUser(userData.id, userData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<User | undefined>) => {
          state.userData = action.payload || undefined;
          state.loading = false;
        }
      )
      .addCase(
        fetchUserData.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Erro ao buscar dados do usuário";
        }
      );

    builder
      .addCase(editUserData.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        editUserData.fulfilled,
        (state, action: PayloadAction<User | undefined>) => {
          state.userData = action.payload || state.userData;
          state.loading = false;
        }
      )
      .addCase(
        editUserData.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Erro ao editar dados do usuário";
        }
      );
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
