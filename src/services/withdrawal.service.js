import {
  createWithdrawal,
  getMyWithdrawals,
  getAdminWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from './withdrawals';

export const withdrawalService = {
  requestWithdrawal: async (data) => {
    const res = await createWithdrawal(data);
    return res?.data || res;
  },
  getMyWithdrawals: async (params) => {
    const res = await getMyWithdrawals(params);
    return res?.data || res;
  },
  getPendingWithdrawals: async (params) => {
    const res = await getPendingWithdrawals(params);
    return res?.data || res;
  },
  getAdminWithdrawals: async (params) => {
    const res = await getAdminWithdrawals(params);
    return res?.data || res;
  },
  approveWithdrawal: async (id) => {
    const res = await approveWithdrawal(id);
    return res?.data || res;
  },
  rejectWithdrawal: async (id, reason) => {
    const res = await rejectWithdrawal(id, reason);
    return res?.data || res;
  },
};

export default withdrawalService;
