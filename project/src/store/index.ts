import { configureStore } from '@reduxjs/toolkit';
import memesReducer from './slices/memesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;