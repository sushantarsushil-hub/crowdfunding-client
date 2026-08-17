import apiClient from './axios.js';

export const healthApi = {
  getHealthStatus: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default healthApi;
