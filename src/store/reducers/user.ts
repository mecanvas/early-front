import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postUserLogin } from '../api/user';

export type UserData = {
  id: number;
  email: string;
  password: string;
  role: 0 | 1; // 0 = 일반 1 = 어드민
  username: string;
  phone: string;
  address: string;
  addressDetail: string;
  createdAt: string;
};

interface InitialState {
  userData: null | UserData;
  isUserLoad: boolean;
  isUserError: null | any;
  isUserDone: boolean;
}

const initialState: InitialState = {
  userData: null,
  isUserLoad: false,
  isUserError: null,
  isUserDone: false,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state, { payload }: PayloadAction<UserData>) => {
      state.userData = payload;
    },
    logoutUser: (state) => {
      state.userData = null;
      state.isUserLoad = false;
      state.isUserError = null;
      state.isUserDone = false;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(postUserLogin.pending, (state) => {
        state.isUserLoad = true;
        state.isUserDone = false;
        state.isUserError = null;
      })
      .addCase(postUserLogin.fulfilled, (state) => {
        state.isUserLoad = false;
        state.isUserDone = true;
      })
      .addCase(postUserLogin.rejected, (state, { payload }) => {
        state.isUserLoad = false;
        state.isUserError = payload;
      }),
});

export const { getUser, logoutUser } = user.actions;

export default user.reducer;
