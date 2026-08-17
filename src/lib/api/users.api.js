import apiClient from './axios.js';

export const usersApi = {
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data?.data?.user || response.data?.user || response.data;
  },
  updateProfile: async (data) => {
    const response = await apiClient.patch('/users/me', data);
    return response.data?.data?.user || response.data?.user || response.data;
  },
  getCredits: async () => {
    const response = await apiClient.get('/users/me/credits');
    return response.data?.data || response.data;
  },
};

export default usersApi;
