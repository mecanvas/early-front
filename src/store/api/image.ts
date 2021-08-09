import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ImgToDataURL } from 'src/utils/ImgToDataURL';
import { putSelectedFrameImage } from '../reducers/frame';
import { getProgressPercentage, uploadImageProgress } from '../reducers/progress';

export const postImageUpload = createAsyncThunk<any, { type: 1 | 2 | 3; fd: any; id: number }>(
  'img/postImageUplaod',
  async (data, { rejectWithValue, dispatch }) => {
    const { fd, type, id } = data;
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

      const imgUrl = await axios
        .post<string>(`/canvas/single/upload`, fd, {
          onUploadProgress: getProgressGage,
          onDownloadProgress: getDownloadProgressGage,
        })
        .then((res) => {
          return res.data;
        });
      dispatch(uploadImageProgress(uploadLoading && downloadLoading));
      await dispatch(putSelectedFrameImage({ type, id, imgUrl }));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
