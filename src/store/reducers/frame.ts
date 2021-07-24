import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { frameRectangle, frameSquare } from 'src/constants';

export interface FrameInfoList {
  id: number;
  type: 1 | 2; // 1 = 정, 2 = 직
  name: string;
  widthCm: number;
  heightCm: number;
  price: number;
  size: {
    width: number;
    height: number;
  };
  recommand: boolean;
}

interface FrameState {
  frameInfoList: FrameInfoList[];
  selectedFrame: FrameInfoList[];
}

const initialState: FrameState = {
  frameInfoList: [...frameSquare, ...frameRectangle],
  selectedFrame: [
    {
      id: 0,
      type: 1,
      name: '',
      widthCm: 0,
      heightCm: 0,
      price: 0,
      size: {
        width: 0,
        height: 0,
      },
      recommand: false,
    },
  ],
};

const frame = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    getSelectedFrame: (state) => {
      state.selectedFrame;
    },
    selectedFrame: (state, { payload }: PayloadAction<FrameInfoList>) => {
      state.selectedFrame.push(payload);
    },
    deleteSelectedFrame: (state, { payload }: PayloadAction<number>) => {
      state.selectedFrame = state.selectedFrame.filter((lst) => lst.id !== payload);
    },
  },
});

export const { getSelectedFrame, selectedFrame, deleteSelectedFrame } = frame.actions;

export default frame.reducer;
