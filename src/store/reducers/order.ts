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

export interface Address {
  postCode: string;
  address: string;
  sido: string;
  sigungu: string;
  addressDetail: string;
}

interface ProductOrderInfo {
  productOrder: ProductOrder[];
  receiver: string;
  address: Address;
  memo: string;
  phone: string;
  phone2: string;
}

interface InitialState {
  productOrder: ProductOrder[];
  deliveryOption: DeliveryOption;
  productOrderInfo: ProductOrderInfo;
}

const initialState: InitialState = {
  productOrder: [],
  deliveryOption: {
    deliveryPrice: 0,
    additionalPrice: 0,
    limit: 0,
  },
  productOrderInfo: {
    productOrder: [],
    receiver: '',
    address: { postCode: '', address: '', sido: '', sigungu: '', addressDetail: '' },
    memo: '',
    phone: '',
    phone2: '',
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
    setProductOrderInfo: (state, { payload }: PayloadAction<ProductOrderInfo>) => {
      state.productOrderInfo = payload;
    },
  },
});

export const { setProductOrder, setProductDeliveryOption, setProductOrderInfo } = order.actions;

export default order.reducer;
