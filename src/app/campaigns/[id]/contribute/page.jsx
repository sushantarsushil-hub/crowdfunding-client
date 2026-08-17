'use client';

import React, { use } from 'react';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import RoleGuard from '../../../../components/auth/RoleGuard';
import CampaignDetailsPage from '../page';

export default function ContributeCampaignRoutePage({ params }) {
  // Ensure Next.js async params resolution
  const resolvedParams = use(params);

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['supporter', 'creator', 'admin']}>
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <CampaignDetailsPage params={Promise.resolve(resolvedParams)} />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
