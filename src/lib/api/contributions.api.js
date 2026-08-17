import apiClient from './axios.js';

export const contributionsApi = {
  createContribution: async (data) => {
    const response = await apiClient.post('/contributions', data);
    return response.data;
  },
  getMyContributions: async (params = {}) => {
    const response = await apiClient.get('/contributions/my-contributions', { params });
    return response.data;
  },
  getCreatorPending: async (params = {}) => {
    const response = await apiClient.get('/contributions/creator/pending', { params });
    return response.data;
  },
  approveContribution: async (id) => {
    const response = await apiClient.patch(`/contributions/${id}/approve`);
    return response.data;
  },
  rejectContribution: async (id, reason) => {
    const response = await apiClient.patch(`/contributions/${id}/reject`, { rejectionReason: reason });
    return response.data;
  },
};

export default contributionsApi;
