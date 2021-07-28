import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CanvasState {
  type: 'single' | 'divided' | null;
  canvasSaveList: {
    name: string;
    saveCanvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    scaleType?: number;
  }[];
}

const initialState: CanvasState = {
  type: null,
  canvasSaveList: [],
};

const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
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

export const { setCanvasSaveList, setCanvasSaveScale } = canvas.actions;

export default canvas.reducer;
