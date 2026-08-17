'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Checkout Cancelled</h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Your credit purchase checkout was cancelled. No charges were made to your payment method.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/supporter/purchase">
            <Button variant="primary" size="md" className="w-full" icon={<RefreshCw className="w-4 h-4" />}>
              Try Again
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="md" className="w-full" icon={<ArrowLeft className="w-4 h-4" />}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
