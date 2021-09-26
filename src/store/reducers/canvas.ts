import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postCanvasForSave } from '../api/canvas';

export interface CanvasOrder {
  username: string;
  phone: string;
  orderRoute: 1 | 2 | 3;
  type?: 1 | 2;
  scaleType?: 1 | 2 | 3 | null; // 1 = 옆면-흰 , 2 = 옆면-배경, 3 = 옆면-좌우반전
}

interface CanvasState {
  isCanvasSaveLoad: boolean;
  isCanvasSaveDone: boolean;
  isCanvasSaveError: any | null;

  type: 'single' | 'divided' | null;
  canvasSaveList: {
    name: string;
    saveCanvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
  }[];
  canvasOrder: CanvasOrder;
}

const initialState: CanvasState = {
  isCanvasSaveLoad: false,
  isCanvasSaveDone: false,
  isCanvasSaveError: null,

  type: null,
  canvasSaveList: [],
  canvasOrder: { username: '', phone: '', orderRoute: 1 },
};

const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvasOrder: (state, { payload }: PayloadAction<CanvasOrder>) => {
      state.canvasOrder = { ...state.canvasOrder, ...payload };
    },
    setCanvasSaveList: (state, { payload }: PayloadAction<{ name: string; saveCanvas?: any; previewCanvas?: any }>) => {
      if (state.canvasSaveList.find((lst) => lst.name === payload.name)) {
        state.canvasSaveList = state.canvasSaveList.map((lst) => ({
          ...lst,
          name: lst.name === payload.name ? payload.name : lst.name,
          saveCanvas: lst.name === payload.name ? payload.saveCanvas : lst.saveCanvas,
          previewCanvas:
            lst.name === payload.name
              ? payload.previewCanvas
                ? payload.previewCanvas
                : lst.previewCanvas
              : lst.previewCanvas,
        }));
      } else {
        state.canvasSaveList = [
          {
            name: payload.name,
            saveCanvas: payload.saveCanvas,
            previewCanvas: payload.previewCanvas,
          },
        ];
      }
    },
    setCanvasSaveScale: (state, { payload }: PayloadAction<{ scaleType: 1 | 2 | 3 | null }>) => {
      state.canvasOrder.scaleType = payload.scaleType;
    },
    resetCanvasState: (state) => {
      state.isCanvasSaveDone = false;
      state.isCanvasSaveLoad = false;
      state.isCanvasSaveError = null;
      state.canvasSaveList = [];
      state.canvasOrder = initialState.canvasOrder;
    },
  },
  extraReducers: (builder) =>
    builder
      // uploadImage
      .addCase(postCanvasForSave.pending, (state) => {
        state.isCanvasSaveLoad = true;
        state.isCanvasSaveDone = false;
        state.isCanvasSaveError = null;
      })
      .addCase(postCanvasForSave.fulfilled, (state) => {
        state.isCanvasSaveLoad = false;
        state.isCanvasSaveDone = true;
      })
      .addCase(postCanvasForSave.rejected, (state, { payload }) => {
        state.isCanvasSaveLoad = false;
        state.isCanvasSaveError = payload;
      }),
});

export const { setCanvasSaveList, setCanvasSaveScale, setCanvasOrder, resetCanvasState } = canvas.actions;

export default canvas.reducer;
