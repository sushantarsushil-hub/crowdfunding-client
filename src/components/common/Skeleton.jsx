'use client';

import React from 'react';

export const Skeleton = ({
  className = '',
  width,
  height,
  borderRadius = '1.5rem',
  style = {},
  ...props
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-700/50 ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
        borderRadius,
        ...style,
      }}
      {...props}
    />
  );
};

export default Skeleton;
