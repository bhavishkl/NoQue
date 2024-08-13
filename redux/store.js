import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import queueReducer from './slices/queueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    queue: queueReducer,
  },
});