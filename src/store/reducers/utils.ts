import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  modalVisible: boolean;
}

const initialState: InitialState = {
  modalVisible: false,
};

const utils = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    setModalVisible: (state, { payload }: PayloadAction<boolean>) => {
      state.modalVisible = payload;
    },
  },
});

export const { setModalVisible } = utils.actions;

export default utils.reducer;
