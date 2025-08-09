import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProfile } from 'src/types/profile';

interface IProfileState {
  profile: IProfile | null;
  loading: boolean;
  error: string | null;
  localAvatarUri: string | null;
}

const initialState: IProfileState = {
  profile: null,
  loading: false,
  error: null,
  localAvatarUri: null,
};

export const profileSagaSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileRequest: state => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<IProfile>) => {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setLocalAvatarUri: (state, action: PayloadAction<string | null>) => {
      state.localAvatarUri = action.payload;
    },
  },
});

export const { fetchProfileRequest, fetchProfileSuccess, fetchProfileFailure, setLocalAvatarUri } =
  profileSagaSlice.actions;

export default profileSagaSlice.reducer;
