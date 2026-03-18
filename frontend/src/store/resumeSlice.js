import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/apiService';

export const fetchResumes = createAsyncThunk('resume/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/resumes');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch resumes');
  }
});

export const fetchResume = createAsyncThunk('resume/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/resumes/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch resume');
  }
});

export const createResume = createAsyncThunk('resume/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/resumes', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create resume');
  }
});

export const updateResume = createAsyncThunk('resume/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/resumes/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update resume');
  }
});

export const deleteResume = createAsyncThunk('resume/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/resumes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete resume');
  }
});

export const duplicateResume = createAsyncThunk('resume/duplicate', async (resumeData, { rejectWithValue }) => {
  try {
    const res = await api.post('/resumes', resumeData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to duplicate resume');
  }
});

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    resumes: [],
    currentResume: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    setCurrentResume: (state, action) => { state.currentResume = action.payload; },
    updateCurrentResume: (state, action) => {
      state.currentResume = { ...state.currentResume, ...action.payload };
    },
    clearCurrentResume: (state) => { state.currentResume = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => { state.loading = true; })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload.resumes;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.currentResume = action.payload.resume;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload.resume);
        state.currentResume = action.payload.resume;
      })
      .addCase(updateResume.pending, (state) => { state.saving = true; })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.saving = false;
        state.currentResume = action.payload.resume;
        const idx = state.resumes.findIndex(r => r._id === action.payload.resume._id);
        if (idx !== -1) state.resumes[idx] = action.payload.resume;
      })
      .addCase(updateResume.rejected, (state) => { state.saving = false; })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
      })
      .addCase(duplicateResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload.resume);
      });
  },
});

export const { setCurrentResume, updateCurrentResume, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;
