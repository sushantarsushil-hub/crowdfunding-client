import { getUserProfile, getUserTransactions } from './users';
import { createCreditCheckout } from './payments';

export const creditService = {
  getBalance: async () => {
    const res = await getUserProfile();
    return res?.data?.user?.credits ?? res?.user?.credits ?? res?.credits ?? 0;
  },
  purchaseCredits: async (packageId) => {
    const res = await createCreditCheckout(packageId);
    return res?.data || res;
  },
  getTransactionHistory: async (params) => {
    const res = await getUserTransactions(params);
    return res?.data || res;
  },
};

export default creditService;
