import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSliceV2';
import resumeReducer from './resumeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
  },
});
