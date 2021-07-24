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
  selectedFrame: [],
};

const frame = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    getSelectedFrame: (state) => {
      state.selectedFrame;
    },
    selectedFrame: (state, { payload }: PayloadAction<FrameInfoList>) => {
      if (state.selectedFrame.find((lst) => lst.name === payload.name)) {
        state.selectedFrame = state.selectedFrame.filter((lst) => lst.name !== payload.name);
        return;
      }
      state.selectedFrame.push(payload);
    },
  },
});

export const { getSelectedFrame, selectedFrame } = frame.actions;

export default frame.reducer;
