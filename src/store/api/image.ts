import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { putSelectedFrameImage } from '../reducers/frame';

export const postImageUpload = createAsyncThunk<any, { type: 1 | 2; fd: any; id: number }>(
  'img/postImageUplaod',
  async (data, { rejectWithValue, dispatch }) => {
    const { fd, type, id } = data;
    try {
      const url = await axios.post<string>(`/canvas/single/upload`, fd).then((res) => {
        return res.data;
      });
      await dispatch(putSelectedFrameImage({ type, id, imgUrl: url }));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
