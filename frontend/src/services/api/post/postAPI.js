import axiosClient from '../axiosClient';

const postAPI = {
  getAll: (page = 1, limit = 10) => axiosClient.get(`/posts?page=${page}&limit=${limit}`),
  getById: (id) => axiosClient.get(`/posts/${id}`),
  create: (data) => axiosClient.post('/posts', data),
  update: (id, data) => axiosClient.put(`/posts/${id}`, data),
  remove: (id) => axiosClient.delete(`/posts/${id}`),
  search: (q, page = 1) => axiosClient.get(`/posts/search?q=${encodeURIComponent(q)}&page=${page}`),
  getByTag: (tag, page = 1) => axiosClient.get(`/posts/tag/${tag}?page=${page}`),
  getByCategory: (category, page = 1) => axiosClient.get(`/posts/category/${category}?page=${page}`),
  toggleLike: (id) => axiosClient.post(`/posts/${id}/like`),
  getMyPosts: (page = 1) => axiosClient.get(`/posts/my-posts?page=${page}`),
  getTrending: () => axiosClient.get('/posts/trending'),
  getUserPosts: (userId, page = 1) => axiosClient.get(`/users/${userId}/posts?page=${page}`),
};

export default postAPI;
