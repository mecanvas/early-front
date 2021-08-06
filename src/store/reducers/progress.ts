import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface progressState {
  isImgUploadDone: boolean;
  isImgUploadLoad: boolean;
  progressPercentage: number;
}

const initialState: progressState = {
  isImgUploadDone: false,
  isImgUploadLoad: false,
  progressPercentage: 0,
};

const progress = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    uploadImageProgress: (state, { payload }: PayloadAction<boolean>) => {
      state.isImgUploadDone = payload;
      state.isImgUploadLoad = false;
      state.progressPercentage = 0;
    },
    getProgressPercentage: (state, { payload }: PayloadAction<number>) => {
      state.progressPercentage = payload;
      state.isImgUploadLoad = true;
      state.isImgUploadDone = false;
    },
  },
});

export const { uploadImageProgress, getProgressPercentage } = progress.actions;

export default progress.reducer;
