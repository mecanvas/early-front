import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CanvasState {
  type: 'single' | 'divided' | null;
}

const initialState: CanvasState = {
  type: null,
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
  },
});

export const { setToolType, getToolType, resetToolType } = canvas.actions;

export default canvas.reducer;
