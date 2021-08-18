import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { combineReducers } from '@reduxjs/toolkit';
import frame from './reducers/frame';
import image from './reducers/image';
import canvas from './reducers/canvas';
import progress from './reducers/progress';
import redirects from './reducers/redirects';
import user from './reducers/user';

const reducer = combineReducers({
  frame,
  redirects,
  image,
  canvas,
  progress,
  user,
});

const middleware = (getDefaultMiddleware: any) => {
  if (process.env.NODE_ENV === 'production') {
    return getDefaultMiddleware({ serializableCheck: false });
  }
  return getDefaultMiddleware({ serializableCheck: false }).concat(logger);
};

export const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
