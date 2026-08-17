import { useQuery } from '@tanstack/react-query';
import usersService from '../services/users';
import { QUERY_KEYS } from '../constants/queryKeys';

export * from './usePayments';

/**
 * Fetch current user credit balance
 */
export const useCreditBalance = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users.profile,
    queryFn: async () => {
      const res = await usersService.getUserProfile();
      return res?.data?.user?.credits ?? res?.user?.credits ?? 0;
    },
    staleTime: 1000 * 60 * 2,
  });
};
