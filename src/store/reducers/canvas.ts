import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CanvasOrder {
  username: string;
  phone: string;
  orderRoute: '1' | '2' | '3';
  type?: '1' | '2';
  originImgUrl?: string;
  paperNames?: string;
}

interface CanvasState {
  type: 'single' | 'divided' | null;
  canvasSaveList: {
    name: string;
    saveCanvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    scaleType?: number;
  }[];
  canvasOrder: CanvasOrder;
}

const initialState: CanvasState = {
  type: null,
  canvasSaveList: [],
  canvasOrder: { username: '', phone: '', orderRoute: '1', type: '1', originImgUrl: '', paperNames: '' },
};

const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvasOrder: (state, { payload }: PayloadAction<CanvasOrder>) => {
      state.canvasOrder = { ...state.canvasOrder, ...payload };
    },
    setCanvasSaveList: (state, { payload }: PayloadAction<{ name: string; saveCanvas: any; previewCanvas: any }>) => {
      if (state.canvasSaveList.find((lst) => lst.name === payload.name)) {
        state.canvasSaveList = state.canvasSaveList.map((lst) => ({
          ...lst,
          name: lst.name === payload.name ? payload.name : lst.name,
          saveCanvas: lst.name === payload.name ? payload.saveCanvas : lst.saveCanvas,
          previewCanvas: lst.name === payload.name ? payload.previewCanvas : lst.previewCanvas,
        }));
        return;
      }
      state.canvasSaveList.push({
        name: payload.name,
        saveCanvas: payload.saveCanvas,
        previewCanvas: payload.previewCanvas,
      });
    },
    setCanvasSaveScale: (state, { payload }: PayloadAction<{ scaleType: number }>) => {
      state.canvasSaveList = [{ ...state.canvasSaveList[0], scaleType: payload.scaleType }];
    },
  },
});

export const { setCanvasSaveList, setCanvasSaveScale, setCanvasOrder } = canvas.actions;

export default canvas.reducer;
