'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CampaignCard from './CampaignCard';
import CampaignSkeletonGrid from './CampaignSkeletonGrid';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import { staggerContainer } from '../../constants/animations';

export const CampaignGrid = ({
  campaigns = [],
  isLoading = false,
  isError = false,
  onRetry,
  emptyTitle = 'No campaigns found',
  emptyDescription = 'Try adjusting your search keywords, category, or deadline filters.',
}) => {
  if (isLoading) {
    return <CampaignSkeletonGrid count={6} />;
  }

  if (isError) {
    return <ErrorState title="Failed to load campaigns" description="Could not connect to backend REST API feed." onRetry={onRetry} />;
  }

  if (!campaigns || campaigns.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {campaigns.map((campaign, idx) => (
        <CampaignCard key={campaign._id || campaign.id || idx} campaign={campaign} />
      ))}
    </motion.div>
  );
};

export default CampaignGrid;
