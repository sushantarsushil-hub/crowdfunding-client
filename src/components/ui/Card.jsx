'use client';

import React from 'react';

export const Card = ({ children, className = '', interactive = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card transition-all duration-300 ${
        interactive ? 'hover:shadow-card-hover hover:border-emerald-200 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-slate-100 pb-4 mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-extrabold text-slate-900 ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-500 mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 mt-4 border-t border-slate-100 flex items-center justify-between ${className}`}>{children}</div>
);

export default Card;
