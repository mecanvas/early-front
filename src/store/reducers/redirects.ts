import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  redirect: {
    naver: string;
    idus: string;
  };
}

const initialState: InitialState = {
  redirect: {
    naver: 'products=5798217286',
    idus: '',
  },
};

const redirects = createSlice({
  initialState,
  name: 'redirects',
  reducers: {
    setRedirect: (state, { payload }: PayloadAction<{ name: 'naver' | 'idus'; value: string }>) => {
      state.redirect[payload.name] = payload.value;
    },
  },
});

export const { setRedirect } = redirects.actions;

export default redirects.reducer;
