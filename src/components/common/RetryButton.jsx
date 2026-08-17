'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export const RetryButton = ({
  onRetry,
  label = 'Retry Request',
  isLoading = false,
  variant = 'danger',
  size = 'sm',
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onRetry}
      isLoading={isLoading}
      icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
      className={className}
    >
      {label}
    </Button>
  );
};

export default RetryButton;
