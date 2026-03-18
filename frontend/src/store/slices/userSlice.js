import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userAPI from '../../services/api/user/userAPI';

export const fetchUserProfile = createAsyncThunk('user/profile', async (id, { rejectWithValue }) => {
  try { return (await userAPI.getProfile(id)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'User not found' }); }
});

export const updateProfile = createAsyncThunk('user/update', async ({ id, data }, { rejectWithValue }) => {
  try { return (await userAPI.update(id, data)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Update failed' }); }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, isLoading: false, error: null },
  reducers: {
    clearProfile: (s) => { s.profile = null; s.error = null; },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchUserProfile.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchUserProfile.fulfilled, (s, a) => { s.isLoading = false; s.profile = a.payload; })
      .addCase(fetchUserProfile.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.message || 'Error'; })
      .addCase(updateProfile.pending, (s) => { s.error = null; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.profile = a.payload; })
      .addCase(updateProfile.rejected, (s, a) => { s.error = a.payload?.message || 'Update failed'; });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
