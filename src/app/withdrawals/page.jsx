'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../../components/loading/Loading';
import useAuth from '../../hooks/use-auth';

export default function WithdrawalsIndexPage() {
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    if (role === 'admin') {
      router.replace('/dashboard/admin/withdrawals');
    } else {
      router.replace('/dashboard/creator/withdrawals');
    }
  }, [router, role]);

  return <Loading message="Redirecting to Withdrawals Portal..." />;
}
