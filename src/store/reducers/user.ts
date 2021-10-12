import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { Address } from 'src/interfaces/OrderInterface';
import { OptionType } from 'src/interfaces/ProductInterface';
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
      const haveItem = (user: UserData | NoneUserData) => {
        if (!user) {
          return [];
        }
        if (!user.cart) {
          return [];
        }

        // 같은 아이템을 저장하면 덮어씌움
        const item = user.cart.find((lst) => lst.product.productTitle === payload[0].product.productTitle);

        if (item) {
          const newCart = user.cart.map((lst) => {
            const cart = current(lst);

            if (cart.product.productTitle === payload[0].product.productTitle) {
              if (cart.product.type === OptionType.SINGLE) {
                return {
                  ...cart,
                  product: {
                    ...cart.product,
                    qty: payload[0].product.qty,
                  },
                };
              } else {
                return { ...cart, product: { ...cart.product, optionSelect: payload[0].product.optionSelect } };
              }
            }
            return cart;
          });

          return newCart;
        }
        if (!item) {
          return [...user.cart, ...payload];
        }
        return user.cart;
      };

      if (state.userData) {
        if (state.userData.cart) {
          if (haveItem(state.userData)) {
            state.userData.cart = [...haveItem(state.userData)];
            return;
          }
          state.userData.cart = [...state.userData.cart, ...payload];
        } else {
          state.userData.cart = payload;
        }
      } else {
        if (state.noneUserData.cart) {
          if (haveItem(state.noneUserData)) {
            state.noneUserData.cart = [...haveItem(state.noneUserData)];
            return;
          }
          state.noneUserData.cart = [...state.noneUserData.cart, ...payload];
        } else {
          state.noneUserData.cart = payload;
        }
      }
    },
    setCartQty: (state, { payload }: PayloadAction<{ productId: number; listId?: number; type: '-' | '+' }>) => {
      const { productId, listId, type } = payload;
      const cartList = state.userData ? state.userData.cart : state.noneUserData.cart;
      if (productId && cartList) {
        const newCart = cartList.map((c) => {
          if (c.product.productId === productId) {
            // 단독이면
            if (c.product.type === OptionType.SINGLE) {
              if (type === '-') {
                return {
                  ...c,
                  product: {
                    ...c.product,
                    qty: c.product.qty && c.product.qty > 1 ? c.product.qty - 1 : c.product.qty,
                  },
                };
              }
              if (type === '+') {
                return {
                  ...c,
                  product: {
                    ...c.product,
                    qty: c.product.qty && c.product.qty > 1 ? c.product.qty + 1 : c.product.qty,
                  },
                };
              }
            }
            // 조합이면
            if (c.product.type === OptionType.MULTI) {
              if (type === '-') {
                return {
                  ...c,
                  product: {
                    ...c.product,
                    optionSelect: c.product.optionSelect
                      ? c.product.optionSelect.map((lst) => ({
                          ...lst,
                          qty: lst.listId === listId && lst.qty > 1 ? lst.qty - 1 : lst.qty,
                        }))
                      : null,
                  },
                };
              }
              if (type === '+') {
                return {
                  ...c,
                  product: {
                    ...c.product,
                    optionSelect: c.product.optionSelect
                      ? c.product.optionSelect.map((lst) => ({
                          ...lst,
                          qty: lst.listId === listId ? lst.qty + 1 : lst.qty,
                        }))
                      : null,
                  },
                };
              }
            }
          }

          return c;
        });
        state.userData ? (state.userData.cart = newCart) : (state.noneUserData.cart = newCart);
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

export const { getUser, setUserCart, setCartQty, logoutUser } = user.actions;

export default user.reducer;
