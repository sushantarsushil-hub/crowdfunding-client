import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  className = '',
  type = 'text',
  id,
  placeholder,
  disabled = false,
  required = false,
  value,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const inputProps = { ...props };
  if ('value' in props || value !== undefined) {
    inputProps.value = value ?? props.value ?? '';
  }

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`
            w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400
            transition-all duration-200 focus:outline-none focus-visible:ring-2 disabled:bg-slate-50 disabled:cursor-not-allowed
            ${startIcon ? 'pl-10' : ''}
            ${endIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-rose-300 focus:border-rose-500 focus-visible:ring-rose-200 text-rose-900' 
              : 'border-slate-200 focus:border-emerald-500 focus-visible:ring-emerald-100 hover:border-slate-300'
            }
            ${className}
          `}
          {...inputProps}
        />

        {endIcon && (
          <div className="absolute right-3 text-slate-400 flex items-center justify-center">
            {endIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-rose-500 font-semibold">{error}</p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
