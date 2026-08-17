import axiosInstance from '../api/axiosInstance';

/**
 * Submit withdrawal request for earned creator credits (Creator role)
 * POST /withdrawals
 * payload: { withdrawal_credit, payment_system, account_number }
 */
export const createWithdrawal = async (data) => {
  const creditValue = Number(data.withdrawal_credit ?? data.withdrawalCredits ?? data.credits);
  const systemValue = data.payment_system || data.paymentSystem || 'Bank Transfer';
  const accountValue = data.account_number || data.accountNumber || '';

  const payload = {
    withdrawal_credit: creditValue,
    withdrawalCredits: creditValue,
    payment_system: systemValue,
    paymentSystem: systemValue,
    account_number: accountValue,
    accountNumber: accountValue,
  };

  const response = await axiosInstance.post('/withdrawals', payload);
  return response.data;
};

export const requestWithdrawal = createWithdrawal;

/**
 * Get Creator's own withdrawal requests history
 * GET /withdrawals/my
 */
export const getMyWithdrawals = async (params = {}) => {
  const response = await axiosInstance.get('/withdrawals/my', { params });
  return response.data;
};

/**
 * Admin: Get all creator withdrawal requests
 * GET /admin/withdrawals
 */
export const getAdminWithdrawals = async (params = {}) => {
  const response = await axiosInstance.get('/admin/withdrawals', { params });
  return response.data;
};

/**
 * Admin: Get pending withdrawal requests queue
 * GET /admin/withdrawals/pending
 */
export const getPendingWithdrawals = async (params = {}) => {
  const response = await axiosInstance.get('/admin/withdrawals/pending', { params });
  return response.data;
};

/**
 * Admin: Approve a withdrawal request
 * PATCH /admin/withdrawals/:id/approve
 */
export const approveWithdrawal = async (id) => {
  const response = await axiosInstance.patch(`/admin/withdrawals/${id}/approve`);
  return response.data;
};

/**
 * Admin: Reject a withdrawal request with reason
 * PATCH /admin/withdrawals/:id/reject
 */
export const rejectWithdrawal = async (id, rejectionReason) => {
  const reason = typeof rejectionReason === 'object' ? rejectionReason.reason : rejectionReason;
  const response = await axiosInstance.patch(`/admin/withdrawals/${id}/reject`, {
    rejectionReason: reason || 'Withdrawal rejected by admin',
  });
  return response.data;
};

const withdrawalsService = {
  createWithdrawal,
  requestWithdrawal,
  getMyWithdrawals,
  getAdminWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
};

export default withdrawalsService;
