import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentAPI from '../../services/api/comment/commentAPI';

export const fetchComments = createAsyncThunk('comments/fetch', async (postId, { rejectWithValue }) => {
  try { return (await commentAPI.getByPost(postId)).data; }
  catch (err) { return rejectWithValue(err.response?.data); }
});

export const addComment = createAsyncThunk('comments/add', async ({ postId, comment }, { rejectWithValue }) => {
  try { return (await commentAPI.add(postId, { comment })).data; }
  catch (err) { return rejectWithValue(err.response?.data); }
});

export const deleteComment = createAsyncThunk('comments/delete', async (id, { rejectWithValue }) => {
  try { await commentAPI.remove(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data); }
});

const commentSlice = createSlice({
  name: 'comments',
  initialState: { comments: [], isLoading: false },
  reducers: { clearComments: (s) => { s.comments = []; } },
  extraReducers: (b) => {
    b.addCase(fetchComments.pending, (s) => { s.isLoading = true; })
     .addCase(fetchComments.fulfilled, (s, a) => { s.isLoading = false; s.comments = a.payload; })
     .addCase(fetchComments.rejected, (s) => { s.isLoading = false; })
     .addCase(addComment.fulfilled, (s, a) => { s.comments.push(a.payload); })
     .addCase(deleteComment.fulfilled, (s, a) => { s.comments = s.comments.filter((c) => c._id !== a.payload); });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
