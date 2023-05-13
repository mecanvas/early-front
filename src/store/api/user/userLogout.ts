import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockAuthLogout } from 'src/utils';

export const postUserLogout = createAsyncThunk<any>('user/postUserLogout', async (_, { rejectWithValue }) => {
  try {
    await mockAuthLogout();
  } catch (err: any) {
    return rejectWithValue(err.response.data);
  }
});
