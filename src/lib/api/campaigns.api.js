import apiClient from './axios.js';

export const campaignsApi = {
  getCampaigns: async (params = {}) => {
    const response = await apiClient.get('/campaigns', { params });
    return response.data;
  },
  getCampaignById: async (id) => {
    const response = await apiClient.get(`/campaigns/${id}`);
    return response.data;
  },
  createCampaign: async (data) => {
    const response = await apiClient.post('/campaigns', data);
    return response.data;
  },
  updateCampaign: async (id, data) => {
    const response = await apiClient.patch(`/campaigns/${id}`, data);
    return response.data;
  },
  deleteCampaign: async (id) => {
    const response = await apiClient.delete(`/campaigns/${id}`);
    return response.data;
  },
  getMyCampaigns: async (params = {}) => {
    const response = await apiClient.get('/campaigns/my-campaigns', { params });
    return response.data;
  },
};

export default campaignsApi;
