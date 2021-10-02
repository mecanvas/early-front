import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from 'src/interfaces/OrderInterface';
import { Cart } from 'src/interfaces/User';
import { postUserLogin } from '../api/user/user';
import { postUserLogout } from '../api/user/userLogout';

export type UserData = {
  id: number;
  email: string;
  role: 0 | 1; // 0 = 일반 1 = 어드민
  username: string;
  phone: string;
  address: Address | null;
  cart: Cart[] | null;
};

export type NoneUserData = {
  id: string;
  cart: Cart[] | null;
};

interface InitialState {
  userData: null | UserData;
  noneUserData: NoneUserData;
  isUserLoad: boolean;
  isUserError: null | any;
  isUserDone: boolean;

  isLogoutLoad: boolean;
  isLogoutError: null | any;
  isLogoutDone: boolean;
}

const initialState: InitialState = {
  userData: null,
  noneUserData: {
    id: '',
    cart: null,
  },
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
    setUserCart: (state, { payload }: PayloadAction<Cart[]>) => {
      if (state.userData) {
        state.userData.cart = state.userData.cart ? [...state.userData.cart, ...payload] : payload;
      } else {
        state.noneUserData.cart = state.noneUserData.cart ? [...state.noneUserData.cart, ...payload] : payload;
      }
    },
    logoutUser: (state) => {
      state.userData = null;
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
      })
      .addCase(postUserLogout.rejected, (state, { payload }) => {
        state.isLogoutLoad = false;
        state.isLogoutError = payload;
      }),
});

export const { getUser, setUserCart, logoutUser } = user.actions;

export default user.reducer;
