'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../../components/loading/Loading';

export default function PaymentIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/supporter/purchase');
  }, [router]);

  return <Loading message="Redirecting to Credit Purchase..." />;
}
