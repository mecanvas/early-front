import { createAsyncThunk } from '@reduxjs/toolkit';
import { MockProgressEvent, mockPostImageUpload } from 'src/utils';
import { putSelectedFrameImage } from '../reducers/frame';
import { getProgressPercentage, uploadImageProgress } from '../reducers/progress';

export const postImageUpload = createAsyncThunk<any, { type: 1 | 2 | 3; fd: any; id: number }>(
  'img/postImageUpload',
  async (data, { rejectWithValue, dispatch }) => {
    const { fd, type, id } = data;
    try {
      let downloadLoading = false;
      let uploadLoading = false;
      const getProgressGage = (data: MockProgressEvent) => {
        const percentage = Math.round((100 * data.loaded) / data.total);
        dispatch(getProgressPercentage(percentage));
        uploadLoading = percentage === 100;
      };
      const getDownloadProgressGage = (data: MockProgressEvent) => {
        const percentage = Math.round((100 * data.loaded) / data.total);
        dispatch(getProgressPercentage(percentage));
        downloadLoading = percentage === 100;
      };

      const imgUrl = await mockPostImageUpload(fd.get('image'), getProgressGage, getDownloadProgressGage);
      dispatch(uploadImageProgress(uploadLoading && downloadLoading));
      await dispatch(putSelectedFrameImage({ type, id, imgUrl: `${imgUrl}` }));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
