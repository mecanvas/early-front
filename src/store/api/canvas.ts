import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// DTO is FormData
export const postCanvasForSave = createAsyncThunk<any, any>(
  'canvas/postCanvasForSave',
  async (data, { rejectWithValue }) => {
    try {
      await axios.post(`/canvas/single/save`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
