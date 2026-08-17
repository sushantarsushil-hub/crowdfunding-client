import axiosInstance from '../api/axiosInstance';

/**
 * Create Stripe Checkout Session for purchasing credit package
 * POST /payments/create-checkout-session
 * payload: { packageId: 'pkg_100' | 'pkg_300' | 'pkg_800' | 'pkg_1500' }
 */
export const createCreditCheckout = async (packageId) => {
  const payload = typeof packageId === 'object' ? packageId : { packageId };
  const response = await axiosInstance.post('/payments/create-checkout-session', payload);
  return response.data;
};

export const createCheckoutSession = createCreditCheckout;
export const purchaseCredits = createCreditCheckout;

/**
 * Verify Stripe Checkout payment session idempotently
 * POST /payments/verify-session
 * payload: { sessionId }
 */
export const verifyPaymentSession = async (sessionId) => {
  const payload = typeof sessionId === 'object' ? sessionId : { sessionId };
  const response = await axiosInstance.post('/payments/verify-session', payload);
  return response.data;
};

/**
 * Get logged-in user payment purchase history
 * GET /payments/my (or GET /users/transactions)
 */
export const getMyPayments = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/payments/my', { params });
    return response.data;
  } catch (err) {
    // Fallback if endpoint is under /users/transactions
    const response = await axiosInstance.get('/users/transactions', { params });
    return response.data;
  }
};

export const getPaymentHistory = getMyPayments;

const paymentsService = {
  createCreditCheckout,
  createCheckoutSession,
  purchaseCredits,
  verifyPaymentSession,
  getMyPayments,
  getPaymentHistory,
};

export default paymentsService;
