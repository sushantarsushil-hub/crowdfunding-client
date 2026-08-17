'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Coins, ShieldCheck, Zap } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import { CREDIT_PACKAGES } from '../../../../constants/credit-rules';
import paymentsService from '../../../../services/payments';

export default function PurchaseCreditPage() {
  const [selectedPackageId, setSelectedPackageId] = useState('credits_300');

  const checkoutMutation = useMutation({
    mutationFn: (pkgId) => paymentsService.purchaseCredits({ packageId: pkgId }),
    onSuccess: (data) => {
      const checkoutUrl = data?.data?.url || data?.url || data?.checkoutUrl;
      if (checkoutUrl) {
        toast.loading('Redirecting to Stripe secure checkout...');
        window.location.href = checkoutUrl;
      } else {
        toast.error('Payment checkout URL was not returned.');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Payment checkout initiation failed. Please try again.');
    },
  });

  const handleCheckout = (pkgId) => {
    // Security Guard: Send ONLY packageId. Prices and credit amounts are strictly derived on server.
    checkoutMutation.mutate(pkgId);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
          Credit Top-Up
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Purchase Contribution Credits
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Select a credit package to back campaigns transparently across the platform.
        </p>
      </div>

      {/* Credit Package Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CREDIT_PACKAGES.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackageId(pkg.id)}
              className={`p-6 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer relative ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl -translate-y-1'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant={pkg.isPopular ? 'primary' : 'neutral'} size="sm">
                    {pkg.badge}
                  </Badge>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Coins className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{pkg.label}</h3>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    {pkg.credits} <span className="text-xs font-bold text-slate-400">Credits</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">
                    ${pkg.priceUSD} USD
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {pkg.description}
                </p>
              </div>

              <Button
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                isLoading={checkoutMutation.isPending && checkoutMutation.variables === pkg.id}
                isDisabled={checkoutMutation.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout(pkg.id);
                }}
                icon={<Zap className="w-4 h-4" />}
              >
                Checkout with Stripe
              </Button>
            </div>
          );
        })}
      </div>

      {/* Security Assurance Footer Note */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-semibold">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Payments are processed securely via Stripe. Package price & credit amounts are verified server-side.</span>
        </div>
      </div>
    </div>
  );
}
