import axiosInstance from '../api/axiosInstance';

/**
 * Health check endpoint service
 * GET ${NEXT_PUBLIC_API_URL}/health
 */
export const checkHealth = async () => {
  const response = await axiosInstance.get('/health');
  return response.data;
};

const healthService = {
  checkHealth,
};

export default healthService;
