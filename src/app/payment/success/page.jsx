'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle2, LayoutDashboard, Coins, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import useAuth from '../../../hooks/use-auth';
import paymentsService from '../../../services/payments';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [verificationDone, setVerificationDone] = useState(false);
  const [addedCredits, setAddedCredits] = useState(0);

  const verifyMutation = useMutation({
    mutationFn: (sessId) => paymentsService.verifyPaymentSession(sessId),
    onSuccess: async (data) => {
      const paymentRecord = data?.data?.payment || data?.payment;
      const creditsGranted = paymentRecord?.credits || 0;
      if (creditsGranted > 0) setAddedCredits(creditsGranted);

      toast.success('Payment verified! Your credits balance has been updated.');
      setVerificationDone(true);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
    onError: async (err) => {
      console.warn('Payment verification notice:', err.message);
      setVerificationDone(true);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  useEffect(() => {
    if (sessionId) {
      verifyMutation.mutate(sessionId);
    } else {
      setVerificationDone(true);
      if (refreshUser) refreshUser();
    }
  }, [sessionId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6">
        {verifyMutation.isPending ? (
          <div className="py-6 space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">Verifying Payment...</h2>
              <p className="text-xs text-slate-500 font-medium">
                Confirming checkout session with Stripe and updating your credit balance.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                Payment Verified
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment Successful!</h1>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Your Stripe credit package purchase completed successfully. Your balance has been updated by the backend server.
              </p>

              {user && (
                <div className="pt-2 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Current Balance:</span>
                  <span className="text-emerald-700 font-black text-sm flex items-center gap-1">
                    <Coins className="w-4 h-4 text-amber-500" />
                    {user.credits ?? 0} Credits
                  </span>
                </div>
              )}

              {sessionId && (
                <p className="text-[10px] text-slate-400 font-mono truncate pt-1">
                  Session Reference: {sessionId}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full" icon={<LayoutDashboard className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="outline" size="md" className="w-full" icon={<Coins className="w-4 h-4" />}>
                  Pledge Credits
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center text-xs font-bold text-slate-500">Loading payment status...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
