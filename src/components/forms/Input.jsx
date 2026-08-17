'use client';

import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  startIcon,
  endIcon,
  className = '',
  required,
  id,
  value,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

  const inputProps = { ...props };
  if ('value' in props || value !== undefined) {
    inputProps.value = value ?? props.value ?? '';
  }

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId || undefined}
          className={`w-full min-h-[44px] rounded-2xl border bg-white px-3.5 py-2.5 text-base sm:text-xs text-slate-900 transition-colors focus:outline-none placeholder:text-slate-400 font-medium focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
            startIcon ? 'pl-10' : ''
          } ${
            endIcon ? 'pr-10' : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
              : 'border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
          } ${className}`}
          {...inputProps}
        />

        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-rose-500 font-medium flex items-center gap-1" role="alert">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] text-slate-400 font-medium">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
