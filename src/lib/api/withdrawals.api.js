import apiClient from './axios.js';

export const withdrawalsApi = {
  createWithdrawal: async (data) => {
    const response = await apiClient.post('/withdrawals', data);
    return response.data;
  },
  getMyWithdrawals: async (params = {}) => {
    const response = await apiClient.get('/withdrawals/my-withdrawals', { params });
    return response.data;
  },
};

export default withdrawalsApi;
