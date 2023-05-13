import { createAsyncThunk } from '@reduxjs/toolkit';
import { MockProgressEvent, mockPostImageUpload } from 'src/utils';
import { getProgressPercentage, uploadImageProgress } from '../reducers/progress';

// DTO is FormData
export const postCanvasForSave = createAsyncThunk<any, any>(
  'canvas/postCanvasForSave',
  async (data, { rejectWithValue, dispatch }) => {
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

      const link = document.createElement('a');
      const fileUrl = await mockPostImageUpload(data.get('image'), getProgressGage, getDownloadProgressGage);

      link.download = 'file.png';
      link.href = fileUrl;

      link.click();
      dispatch(uploadImageProgress(downloadLoading && uploadLoading));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
