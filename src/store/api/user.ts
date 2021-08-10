import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUser, logoutUser, UserData } from '../reducers/user';

// DTO is Email, Password
export const postUserLogin = createAsyncThunk<any, { email: string; password: string }>(
  'user/postUserLogin',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const user = await axios
        .post<UserData>(`/auth/login`, data)
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (user) {
        dispatch(getUser(user));
      }
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const postUserLogout = createAsyncThunk<any, any>(
  'user/postUserLogout',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const user = await axios.post<UserData>(`/auth/logout`).then((res) => res.data);
      if (user) {
        dispatch(logoutUser);
      }
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
