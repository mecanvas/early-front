import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserData } from 'src/store/reducers/user';

export const postUserLogout = createAsyncThunk<any>('user/postUserLogout', async (_, { rejectWithValue }) => {
  try {
    await axios.post<UserData>(`/auth/logout`).then((res) => res.data);
    window.location.href = '/';
  } catch (err: any) {
    return rejectWithValue(err.response.data);
  }
});
