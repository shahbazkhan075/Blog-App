import axiosClient from '../axiosClient';

const userAPI = {
  getProfile: (id) => axiosClient.get(`/users/${id}`),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  getUserPosts: (id, page = 1) => axiosClient.get(`/users/${id}/posts?page=${page}`),
};

export default userAPI;
