import { createSlice } from '@reduxjs/toolkit';

export interface FrameState {
  attribute: string;
  name: string;
  widthCm: number;
  heightCm: number;
  price: number;
  size: {
    width: number;
    height: number;
  };
}

const initialState: FrameState = {
  attribute: '',
  name: '',
  widthCm: 0,
  heightCm: 0,
  price: 0,
  size: {
    width: 0,
    height: 0,
  },
};

const frame = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    getFrameState: (state) => {
      state;
    },
  },
});

export const { getFrameState } = frame.actions;

export default frame.reducer;
