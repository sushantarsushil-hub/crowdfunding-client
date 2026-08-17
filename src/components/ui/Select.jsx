'use client';

import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  required,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const errorId = error && selectId ? `${selectId}-error` : undefined;
  const helperId = helperText && selectId ? `${selectId}-helper` : undefined;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId || undefined}
          className={`w-full min-h-[44px] appearance-none rounded-2xl border bg-white px-4 py-2.5 pr-10 text-base sm:text-xs font-semibold text-slate-900 transition-colors focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            error ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
          } ${className}`}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          )}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" aria-hidden="true" />
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-rose-500 font-medium" role="alert">{error}</p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] text-slate-400 font-medium">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
