import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postImageUplaod } from '../api/image';

export interface Img {
  id: number;
  url: string;
}

interface ImgState {
  imageUploadLoad: boolean;
  imageUploadDone: boolean;
  imageUploadError: any | null;
  imageUrl: Img[];
}

const initialState: ImgState = {
  imageUploadLoad: false,
  imageUploadDone: false,
  imageUploadError: null,
  imageUrl: [{ id: 0, url: '' }],
};

const img = createSlice({
  name: 'img',
  initialState,
  reducers: {
    deleteImageUrl: (state, { payload }: PayloadAction<number>) => {
      state.imageUrl = state.imageUrl.filter((lst) => lst.id !== payload);
    },
  },
  extraReducers: (builder) =>
    builder
      // uploadImage
      .addCase(postImageUplaod.pending, (state) => {
        state.imageUploadLoad = true;
        state.imageUploadDone = false;
        state.imageUploadError = null;
      })
      .addCase(postImageUplaod.fulfilled, (state, { payload }) => {
        state.imageUploadLoad = false;
        state.imageUrl.push(payload);
        state.imageUploadDone = true;
      })
      .addCase(postImageUplaod.rejected, (state, { payload }) => {
        state.imageUploadLoad = true;
        state.imageUploadError = payload;
      }),
});

export const { deleteImageUrl } = img.actions;

export default img.reducer;
