import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postAPI from '../../services/api/post/postAPI';

const handle = (fn) => async (arg, { rejectWithValue }) => {
  try { return (await fn(arg)).data; }
  catch (err) { return rejectWithValue(err.response?.data); }
};

export const fetchPosts = createAsyncThunk('posts/fetchAll', handle(({ page = 1, limit = 10 } = {}) => postAPI.getAll(page, limit)));
export const fetchPostsByCategory = createAsyncThunk('posts/byCategory', handle(({ category, page = 1 }) => postAPI.getByCategory(category, page)));
export const searchPosts = createAsyncThunk('posts/search', handle(({ q, page = 1 }) => postAPI.search(q, page)));
export const fetchPostById = createAsyncThunk('posts/byId', handle((id) => postAPI.getById(id)));
export const createPost = createAsyncThunk('posts/create', handle((data) => postAPI.create(data)));
export const updatePost = createAsyncThunk('posts/update', handle(({ id, data }) => postAPI.update(id, data)));
export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try { await postAPI.remove(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data); }
});
export const toggleLike = createAsyncThunk('posts/like', handle((id) => postAPI.toggleLike(id)));
export const fetchMyPosts = createAsyncThunk('posts/mine', handle(({ page = 1 } = {}) => postAPI.getMyPosts(page)));
export const fetchUserPosts = createAsyncThunk('posts/userPosts', async ({ userId, page = 1 }, { rejectWithValue }) => {
  try { return (await postAPI.getUserPosts(userId, page)).data; }
  catch (err) { return rejectWithValue(err.response?.data); }
});

const setLoading = (s) => { s.isLoading = true; s.error = null; };
const setError = (s, a) => { s.isLoading = false; s.error = a.payload?.message || 'Error'; };

const postSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], myPosts: [], userPosts: [], currentPost: null, isLoading: false, error: null, pagination: null },
  reducers: { clearCurrentPost: (s) => { s.currentPost = null; } },
  extraReducers: (b) => {
    b.addCase(fetchPosts.pending, setLoading)
     .addCase(fetchPosts.fulfilled, (s, a) => { s.isLoading = false; s.posts = a.payload.posts; s.pagination = a.payload.pagination; })
     .addCase(fetchPosts.rejected, setError)
     .addCase(fetchPostsByCategory.pending, setLoading)
     .addCase(fetchPostsByCategory.fulfilled, (s, a) => { s.isLoading = false; s.posts = a.payload.posts; s.pagination = a.payload.pagination; })
     .addCase(fetchPostsByCategory.rejected, setError)
     .addCase(searchPosts.pending, setLoading)
     .addCase(searchPosts.fulfilled, (s, a) => { s.isLoading = false; s.posts = a.payload.posts; s.pagination = a.payload.pagination; })
     .addCase(searchPosts.rejected, setError)
     .addCase(fetchPostById.pending, setLoading)
     .addCase(fetchPostById.fulfilled, (s, a) => { s.isLoading = false; s.currentPost = a.payload; })
     .addCase(fetchPostById.rejected, setError)
     .addCase(createPost.fulfilled, (s, a) => { s.myPosts.unshift(a.payload); })
     .addCase(updatePost.fulfilled, (s, a) => {
       s.currentPost = a.payload;
       s.myPosts = s.myPosts.map((p) => p._id === a.payload._id ? a.payload : p);
     })
     .addCase(deletePost.fulfilled, (s, a) => {
       s.posts = s.posts.filter((p) => p._id !== a.payload);
       s.myPosts = s.myPosts.filter((p) => p._id !== a.payload);
     })
     .addCase(toggleLike.fulfilled, (s, a) => {
       if (s.currentPost?._id === a.payload._id) s.currentPost = a.payload;
       s.posts = s.posts.map((p) => p._id === a.payload._id ? a.payload : p);
     })
     .addCase(fetchMyPosts.pending, setLoading)
     .addCase(fetchMyPosts.fulfilled, (s, a) => { s.isLoading = false; s.myPosts = a.payload.posts; s.pagination = a.payload.pagination; })
     .addCase(fetchMyPosts.rejected, setError)
     .addCase(fetchUserPosts.pending, setLoading)
     .addCase(fetchUserPosts.fulfilled, (s, a) => { s.isLoading = false; s.userPosts = a.payload.posts; })
     .addCase(fetchUserPosts.rejected, setError);
  },
});

export const { clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;
