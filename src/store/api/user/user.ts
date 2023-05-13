import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUser } from 'src/store/reducers/user';
import { mockAuthLogin } from 'src/utils';

// DTO is Email, Password
export const postUserLogin = createAsyncThunk<any, { email: string; password: string }>(
  'user/postUserLogin',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await mockAuthLogin()
        .then((data) => {
          dispatch(getUser(data));
        })
        .catch((err) => console.log(err));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
