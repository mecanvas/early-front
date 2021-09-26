import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getProgressPercentage, uploadImageProgress } from '../reducers/progress';

// DTO is FormData
export const postCanvasForSave = createAsyncThunk<any, any>(
  'canvas/postCanvasForSave',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      let downloadLoading = false;
      let uploadLoading = false;
      const getProgressGage = (data: ProgressEvent) => {
        const percentage = Math.round((100 * data.loaded) / data.total);
        dispatch(getProgressPercentage(percentage));
        uploadLoading = percentage === 100;
      };
      const getDownloadProgressGage = (data: ProgressEvent) => {
        const percentage = Math.round((100 * data.loaded) / data.total);
        dispatch(getProgressPercentage(percentage));
        downloadLoading = percentage === 100;
      };

      await axios.post(`/canvas/single/save`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: getProgressGage,
        onDownloadProgress: getDownloadProgressGage,
      });
      dispatch(uploadImageProgress(uploadLoading && downloadLoading));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
