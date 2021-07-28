import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CanvasState {
  type: 'single' | 'divided' | null;
  canvasSaveList: { name: string; canvas: HTMLCanvasElement }[];
}

const initialState: CanvasState = {
  type: null,
  canvasSaveList: [],
};

const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setToolType: (state, { payload }: PayloadAction<'single' | 'divided'>) => {
      state.type = payload;
    },
    getToolType: (state) => {
      state.type;
    },
    resetToolType: (state) => {
      state.type = initialState.type;
    },
    setCanvasSaveList: (state, { payload }: PayloadAction<{ name: string; canvas: any }>) => {
      if (state.canvasSaveList.find((lst) => lst.name === payload.name)) {
        state.canvasSaveList = state.canvasSaveList.map((lst) => ({
          ...lst,
          name: lst.name === payload.name ? payload.name : lst.name,
          canvas: lst.name === payload.name ? payload.canvas : lst.canvas,
        }));
        return;
      }
      state.canvasSaveList.push({ name: payload.name, canvas: payload.canvas });
    },
  },
});

export const { setToolType, getToolType, resetToolType, setCanvasSaveList } = canvas.actions;

export default canvas.reducer;
