import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from 'src/types/user';

interface IUserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  loading: false,
  error: null,
};

export const userSagaSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserRequest: (
      state,
      _action: PayloadAction<{ fullName?: string }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<IUser>) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchUserRequest, fetchUserSuccess, fetchUserFailure } =
  userSagaSlice.actions;

export default userSagaSlice.reducer;
