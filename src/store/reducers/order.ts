import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductOrder {
  id: number;
  value: string;
  qty: number;
  price: number;
}

interface InitialState {
  productOrder: ProductOrder[];
}

const initialState: InitialState = {
  productOrder: [],
};

const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setProductOrder: (state, { payload }: PayloadAction<ProductOrder[]>) => {
      state.productOrder = payload;
    },
  },
});

export const { setProductOrder } = order.actions;

export default order.reducer;
