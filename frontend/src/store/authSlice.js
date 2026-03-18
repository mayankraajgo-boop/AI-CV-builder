import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/apiService';

const user = JSON.parse(localStorage.getItem('cvpilot_user') || 'null');
const token = localStorage.getItem('cvpilot_token');

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('cvpilot_user');
      localStorage.removeItem('cvpilot_token');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleAuth = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('cvpilot_user', JSON.stringify(action.payload.user));
      localStorage.setItem('cvpilot_token', action.payload.token);
    };
    const handleReject = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleAuth)
      .addCase(register.rejected, handleReject)
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, handleAuth)
      .addCase(login.rejected, handleReject)
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('cvpilot_user', JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem('cvpilot_user', JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, handleReject);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
