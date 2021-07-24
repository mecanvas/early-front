import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { combineReducers } from '@reduxjs/toolkit';
import frame from './reducers/frame';

const reducer = combineReducers({
  frame,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
