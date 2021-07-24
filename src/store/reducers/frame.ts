import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FrameInfo {
  id: number;
  type: string;
  name: string;
  widthCm: number;
  heightCm: number;
  price: number;
  size: {
    width: number;
    height: number;
  };
}

interface FrameState {
  frameInfo: FrameInfo[];
}

const initialState: FrameState = {
  frameInfo: [
    {
      id: 0,
      type: '',
      name: '',
      widthCm: 0,
      heightCm: 0,
      price: 0,
      size: {
        width: 0,
        height: 0,
      },
    },
  ],
};

const frame = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    getFrameInfo: (state) => {
      state.frameInfo;
    },
    pushFrameInfo: (state, { payload }) => {
      state.frameInfo.push(payload);
    },
    deleteFrameInfo: (state, { payload }: PayloadAction<number>) => {
      state.frameInfo = state.frameInfo.filter((lst) => lst.id !== payload);
    },
  },
});

export const { getFrameInfo, pushFrameInfo, deleteFrameInfo } = frame.actions;

export default frame.reducer;
