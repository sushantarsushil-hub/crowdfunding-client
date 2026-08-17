'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-button hover:shadow-lg hover:shadow-emerald-500/20 border border-emerald-500',
    secondary: 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-xs border border-slate-800',
    outline: 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs',
    darkOutline: 'bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 active:bg-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-rose-500',
    success: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 rounded-2xl gap-2',
    lg: 'text-sm sm:text-base px-6 py-3 rounded-2xl gap-2.5',
  };

  const disabled = isDisabled || isLoading;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.12 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && icon && iconPosition === 'right' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
    </motion.button>
  );
};

export default Button;
