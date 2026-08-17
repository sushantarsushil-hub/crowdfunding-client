'use client';

import React from 'react';
import Link from 'next/link';
import { SearchX, Home, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

export const NotFoundState = ({
  title = 'Resource Not Found',
  description = 'The requested campaign, page, or record could not be found or has been moved.',
  actionText = 'Explore Active Campaigns',
  actionHref = '/campaigns',
}) => {
  return (
    <div className="min-h-[380px] w-full bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm my-6">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
        <SearchX className="w-8 h-8 text-slate-400" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="outline" size="sm" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        {actionHref && (
          <Link href={actionHref}>
            <Button variant="primary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              {actionText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFoundState;
