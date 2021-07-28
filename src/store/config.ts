import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { combineReducers } from '@reduxjs/toolkit';
import frame from './reducers/frame';
import image from './reducers/image';
import canvas from './reducers/canvas';

const reducer = combineReducers({
  frame,
  image,
  canvas,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
