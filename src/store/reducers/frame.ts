import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { frameRectangleMoreHeightThanWidth, frameSquare } from 'src/constants';

export interface FrameInfoList {
  id: number;
  type: 1 | 2; // 1 = 탁상용, 2 = 벽걸이용
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

export interface SelectedFrame extends FrameInfoList {
  imgUrl?: string;
  x?: number;
  y?: number;
  originWidth?: number;
  originHeight?: number;
  bgColor?: string;
  isRotate?: boolean;
}

interface FrameState {
  frameInfoList: FrameInfoList[];
  selectedFrame: SelectedFrame[];
}

const initialState: FrameState = {
  frameInfoList: [...frameSquare, ...frameRectangleMoreHeightThanWidth],
  selectedFrame: [],
};

const frame = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    resetFrameState: (state) => {
      state.selectedFrame = [];
    },
    rotateSelectedFrameList: (state, { payload }: PayloadAction<{ type: number; id: number }>) => {
      state.frameInfoList = state.frameInfoList.map((lst) => ({
        ...lst,
        widthCm: lst.id === payload.id && lst.type === payload.type ? lst.heightCm : lst.widthCm,
        heightCm: lst.id === payload.id && lst.type === payload.type ? lst.widthCm : lst.heightCm,
        size: {
          ...lst.size,
          width: lst.id === payload.id && lst.type === payload.type ? lst.size.height : lst.size.width,
          height: lst.id === payload.id && lst.type === payload.type ? lst.size.width : lst.size.height,
        },
      }));
      state.selectedFrame = state.selectedFrame.map((lst) => ({
        ...lst,
        widthCm: lst.id === payload.id && lst.type === payload.type ? lst.heightCm : lst.widthCm,
        heightCm: lst.id === payload.id && lst.type === payload.type ? lst.widthCm : lst.heightCm,
        originWidth: lst.id === payload.id && lst.type === payload.type ? lst.originHeight : lst.originWidth,
        originHeight: lst.id === payload.id && lst.type === payload.type ? lst.originWidth : lst.originHeight,
        size: {
          ...lst.size,
          width: lst.id === payload.id && lst.type === payload.type ? lst.size.height : lst.size.width,
          height: lst.id === payload.id && lst.type === payload.type ? lst.size.width : lst.size.height,
        },
        isRotate: !lst.isRotate,
      }));
    },
    selectedFrame: (state, { payload }: PayloadAction<FrameInfoList>) => {
      // if (state.selectedFrame.find((lst) => lst.name === payload.name)) {
      //   state.selectedFrame = state.selectedFrame.filter((lst) => lst.name !== payload.name);
      //   return;
      // }
      state.selectedFrame = [payload];
    },
    deleteSelectedFrame: (state, { payload }: PayloadAction<string>) => {
      state.selectedFrame = state.selectedFrame.filter((lst) => lst.name !== payload);
    },
    putSelectedFrameImage: (state, { payload }: PayloadAction<{ type: number; id: number; imgUrl: string }>) => {
      state.selectedFrame = state.selectedFrame.map((lst) => ({
        ...lst,
        imgUrl: lst.type === payload.type && lst.id === payload.id ? payload.imgUrl : lst.imgUrl,
      }));
    },
    setBgColorFrame: (state, { payload }: PayloadAction<{ bgColor: string }>) => {
      state.selectedFrame = state.selectedFrame.map((lst) => ({ ...lst, bgColor: payload.bgColor }));
    },
    updatePositionByFrame: (
      state,
      { payload }: PayloadAction<{ name: string; x: number; y: number; width?: number; height?: number }>,
    ) => {
      state.selectedFrame = state.selectedFrame.map((lst) => ({
        ...lst,
        name: lst.name === payload.name ? payload.name : lst.name,
        x: lst.name === payload.name ? (payload.x > 0 ? payload.x : 0) : lst.x,
        y: lst.name === payload.name ? (payload.y > 0 ? payload.y : 0) : lst.y,
        size: {
          ...lst.size,
          width: lst.name === payload.name && payload.width ? payload.width : lst.size.width,
          height: lst.name === payload.name && payload.height ? payload.height : lst.size.height,
        },
      }));
    },
    setFrameSize: (state, { payload }: PayloadAction<{ resizeWidth: number; resizeHeight: number }>) => {
      state.selectedFrame = state.selectedFrame.map((lst) => ({
        ...lst,
        size: {
          ...lst.size,
          width: payload.resizeWidth,
          height: payload.resizeHeight,
        },
      }));
    },
    setOriginSize: (state, { payload }: PayloadAction<{ originWidth: number; originHeight: number }>) => {
      state.selectedFrame = state.selectedFrame.map((lst) => ({
        ...lst,
        originWidth: payload.originWidth,
        originHeight: payload.originHeight,
      }));
    },
    deletePositionByFrame: (state) => {
      state.selectedFrame = state.frameInfoList.filter((lst) => lst.name === state.selectedFrame[0].name);
    },
  },
});

export const {
  resetFrameState,
  selectedFrame,
  rotateSelectedFrameList,
  deleteSelectedFrame,
  putSelectedFrameImage,
  updatePositionByFrame,
  deletePositionByFrame,
  setBgColorFrame,
  setFrameSize,
  setOriginSize,
} = frame.actions;

export default frame.reducer;
