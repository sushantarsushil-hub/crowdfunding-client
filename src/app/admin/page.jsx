'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../../components/loading/Loading';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin');
  }, [router]);

  return <Loading message="Redirecting to Admin Portal..." />;
}
