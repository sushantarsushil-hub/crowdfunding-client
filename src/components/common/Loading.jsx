import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ 
  message = "Loading...", 
  fullPage = false, 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-slate-600">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-emerald-600`} />
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '1.5s' }} />
      </div>
      {message && (
        <p className="text-sm font-semibold text-slate-500 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 flex flex-col items-center">
          {content}
        </div>
      </div>
    );
  }

  return <div className="w-full flex justify-center py-16">{content}</div>;
};

export default Loading;

