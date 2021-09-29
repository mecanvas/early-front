import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryOption } from 'src/interfaces/ProductInterface';

export interface ProductOrder {
  optionId: number;
  productId: number;
  thumb: string;
  value: string;
  qty: number;
  price: number;
}

interface InitialState {
  productOrder: ProductOrder[];
  deliveryOption: DeliveryOption;
}

const initialState: InitialState = {
  productOrder: [],
  deliveryOption: {
    deliveryPrice: 0,
    additionalPrice: 0,
    limit: 0,
  },
};

const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setProductOrder: (state, { payload }: PayloadAction<ProductOrder[]>) => {
      state.productOrder = payload;
    },
    setProductDeliveryOption: (state, { payload }: PayloadAction<DeliveryOption>) => {
      state.deliveryOption = payload;
    },
  },
});

export const { setProductOrder, setProductDeliveryOption } = order.actions;

export default order.reducer;
