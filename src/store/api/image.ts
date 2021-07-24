import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Img } from '../reducers/image';

export const postImageUplaod = createAsyncThunk<Img, { type: string; fd: any; id: number }>(
  'img/postImageUplaod',
  async (data, { rejectWithValue }) => {
    const { fd, id, type } = data;
    try {
      const url = await axios.post<string>(`/canvas/${type}/upload`, fd).then((res) => {
        return res.data;
      });
      return { id, url };
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
