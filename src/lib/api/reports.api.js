import apiClient from './axios.js';

export const reportsApi = {
  submitReport: async (data) => {
    const response = await apiClient.post('/reports', data);
    return response.data;
  },
};

export default reportsApi;
