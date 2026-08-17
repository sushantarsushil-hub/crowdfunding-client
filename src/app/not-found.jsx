'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">404 — Page Not Found</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The page or campaign you are looking for may have been moved, deleted, or does not exist.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link href="/">
            <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
