import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postUserLogin } from '../api/user/user';
import { postUserLogout } from '../api/user/userLogout';

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

  isLogoutLoad: boolean;
  isLogoutError: null | any;
  isLogoutDone: boolean;
}

const initialState: InitialState = {
  userData: null,

  isUserLoad: false,
  isUserError: null,
  isUserDone: false,

  isLogoutLoad: false,
  isLogoutError: null,
  isLogoutDone: false,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state, { payload }: PayloadAction<UserData>) => {
      state.userData = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      // 유저 로그인
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
      })
      // 유저 로그아웃
      .addCase(postUserLogout.pending, (state) => {
        state.isLogoutLoad = true;
        state.isLogoutDone = false;
        state.isLogoutError = null;
      })
      .addCase(postUserLogout.fulfilled, (state) => {
        state.isLogoutLoad = false;
        state.isLogoutDone = true;
        state.isUserLoad = false;
        state.isUserError = null;
        state.isUserDone = false;
        state.userData = null;
      })
      .addCase(postUserLogout.rejected, (state, { payload }) => {
        state.isLogoutLoad = false;
        state.isLogoutError = payload;
      }),
});

export const { getUser } = user.actions;

export default user.reducer;
