import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import paymentsService from '../services/payments';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Fetch logged-in user credit purchase payments history
 */
export const useMyPayments = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.payments.my(params),
    queryFn: () => paymentsService.getMyPayments(params),
    staleTime: 1000 * 60 * 3,
  });
};

export const usePaymentHistory = useMyPayments;

/**
 * Mutation: Create Stripe Checkout session for package purchase
 */
export const useCreateCreditCheckout = () => {
  return useMutation({
    mutationFn: (packageId) => paymentsService.createCreditCheckout(packageId),
    onSuccess: (data) => {
      const url = data?.data?.url || data?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.success('Checkout session created!');
      }
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to initiate checkout.');
    },
  });
};

export const usePurchaseCredits = useCreateCreditCheckout;
export const useCreatePaymentSession = useCreateCreditCheckout;

/**
 * Mutation: Verify Stripe payment session
 */
export const useVerifyPaymentSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId) => paymentsService.verifyPaymentSession(sessionId),
    onSuccess: () => {
      toast.success('Payment verified and credits added to your balance!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payments.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to verify payment session.');
    },
  });
};

export default {
  useMyPayments,
  usePaymentHistory,
  useCreateCreditCheckout,
  usePurchaseCredits,
  useVerifyPaymentSession,
};
