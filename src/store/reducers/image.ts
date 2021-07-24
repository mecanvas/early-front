import { createSlice } from '@reduxjs/toolkit';
import { postImageUpload } from '../api/image';

interface ImgState {
  imageUploadLoad: boolean;
  imageUploadDone: boolean;
  imageUploadError: any | null;
}

const initialState: ImgState = {
  imageUploadLoad: false,
  imageUploadDone: false,
  imageUploadError: null,
};

const img = createSlice({
  name: 'img',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      // uploadImage
      .addCase(postImageUpload.pending, (state) => {
        state.imageUploadLoad = true;
        state.imageUploadDone = false;
        state.imageUploadError = null;
      })
      .addCase(postImageUpload.fulfilled, (state) => {
        state.imageUploadLoad = false;
        state.imageUploadDone = true;
      })
      .addCase(postImageUpload.rejected, (state, { payload }) => {
        state.imageUploadLoad = false;
        state.imageUploadError = payload;
      }),
});

export default img.reducer;
