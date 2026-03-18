import axiosClient from '../axiosClient';

const commentAPI = {
  getByPost: (postId) => axiosClient.get(`/posts/${postId}/comments`),
  add: (postId, data) => axiosClient.post(`/posts/${postId}/comments`, data),
  remove: (id) => axiosClient.delete(`/comments/${id}`),
};

export default commentAPI;
