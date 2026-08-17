'use client';

import React from 'react';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import RoleGuard from '../../../components/auth/RoleGuard';
import AddCampaignPage from '../../dashboard/creator/campaigns/new/page';

export default function CreateCampaignRoutePage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['creator', 'admin']}>
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <AddCampaignPage />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
