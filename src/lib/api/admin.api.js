import apiClient from './axios.js';

export const adminApi = {
  getStats: async () => {
    const response = await apiClient.get('/admin/dashboard-stats');
    return response.data;
  },
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },
  updateUserRole: async (userId, role) => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },
  getAllCampaigns: async (params = {}) => {
    const response = await apiClient.get('/admin/campaigns', { params });
    return response.data;
  },
  getPendingCampaigns: async (params = {}) => {
    const response = await apiClient.get('/admin/campaigns/pending', { params });
    return response.data;
  },
  approveCampaign: async (id) => {
    const response = await apiClient.patch(`/admin/campaigns/${id}/approve`);
    return response.data;
  },
  rejectCampaign: async (id, reason) => {
    const response = await apiClient.patch(`/admin/campaigns/${id}/reject`, { rejectionReason: reason });
    return response.data;
  },
  getPendingWithdrawals: async (params = {}) => {
    const response = await apiClient.get('/admin/withdrawals/pending', { params });
    return response.data;
  },
  approveWithdrawal: async (id) => {
    const response = await apiClient.patch(`/admin/withdrawals/${id}/approve`);
    return response.data;
  },
  rejectWithdrawal: async (id, reason) => {
    const response = await apiClient.patch(`/admin/withdrawals/${id}/reject`, { rejectionReason: reason });
    return response.data;
  },
  getReports: async (params = {}) => {
    const response = await apiClient.get('/admin/reports', { params });
    return response.data;
  },
  resolveReport: async (id) => {
    const response = await apiClient.patch(`/admin/reports/${id}/resolve`);
    return response.data;
  },
};

export default adminApi;
