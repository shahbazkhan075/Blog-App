import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../services/api/auth/authAPI';
import toast from 'react-hot-toast';

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(creds);
    toast.success('Welcome back!');
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
    return rejectWithValue(err.response?.data);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    toast.success('Account created!');
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed');
    return rejectWithValue(err.response?.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, isLoading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      toast.success('Logged out');
    },
    updateUser: (state, action) => { state.user = { ...state.user, ...action.payload }; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.isLoading = true; s.error = null; })
     .addCase(login.fulfilled, (s, a) => {
       s.isLoading = false; s.user = a.payload.user; s.token = a.payload.token;
       localStorage.setItem('token', a.payload.token);
     })
     .addCase(login.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.message; })
     .addCase(register.pending, (s) => { s.isLoading = true; s.error = null; })
     .addCase(register.fulfilled, (s, a) => {
       s.isLoading = false; s.user = a.payload.user; s.token = a.payload.token;
       localStorage.setItem('token', a.payload.token);
     })
     .addCase(register.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.message; });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
