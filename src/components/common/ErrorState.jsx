'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import RetryButton from './RetryButton';

export const ErrorState = ({
  title = 'Unable to Load Information',
  message,
  description = 'We ran into a network or service issue while connecting to the server. Please try again.',
  onRetry,
  isRetrying = false,
  className = '',
}) => {
  // Sanitize any raw technical stack trace strings if passed in err object
  const cleanMessage =
    typeof message === 'string' && !message.includes('Error:') && !message.includes('at ')
      ? message
      : description;

  return (
    <div
      className={`min-h-[260px] w-full bg-rose-50/60 rounded-3xl border border-rose-200 p-8 flex flex-col items-center justify-center text-center space-y-4 text-rose-900 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h3 className="font-extrabold text-base text-rose-950">{title}</h3>
        <p className="text-xs text-rose-700 font-medium leading-relaxed">{cleanMessage}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <RetryButton onRetry={onRetry} isLoading={isRetrying} />
        </div>
      )}
    </div>
  );
};

export default ErrorState;
