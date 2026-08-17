import apiClient from './axios.js';

export const paymentsApi = {
  createCheckoutSession: async (payload) => {
    const response = await apiClient.post('/payments/create-checkout-session', payload);
    return response.data;
  },
  verifySession: async (payload) => {
    const response = await apiClient.post('/payments/verify-session', payload);
    return response.data;
  },
  getMyPayments: async (params = {}) => {
    const response = await apiClient.get('/payments/my-payments', { params });
    return response.data;
  },
};

export default paymentsApi;
