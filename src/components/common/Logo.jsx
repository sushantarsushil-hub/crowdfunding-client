'use client';

import React from 'react';
import Link from 'next/link';

export const Logo = ({ size = 'md', variant = 'light', className = '' }) => {
  const isDark = variant === 'dark';

  // Size scaling options
  const dimensions = {
    sm: { height: 32, width: 140, textClass: 'text-base', subClass: 'text-[7px]' },
    md: { height: 42, width: 180, textClass: 'text-xl', subClass: 'text-[9px]' },
    lg: { height: 54, width: 230, textClass: 'text-2xl', subClass: 'text-[11px]' },
  };

  const dim = dimensions[size] || dimensions.md;

  return (
    <Link
      href="/"
      className={`inline-flex items-center group focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl p-1 transition-all ${className}`}
      aria-label="FundFlow Homepage"
    >
      <div className="flex items-center space-x-2.5">
        {/* Ribbon Heart & Wave Leaf Vector Icon */}
        <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
          <svg
            width={dim.height * 1.1}
            height={dim.height}
            viewBox="0 0 100 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-xs"
          >
            <defs>
              {/* Vibrant Teal to Cyan Ribbon Gradients */}
              <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>

              <linearGradient id="ribbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="50%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>

              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {/* Left Ribbon Loop */}
            <path
              d="M50 78 C30 65, 10 50, 10 30 C10 15, 24 6, 38 12 C44 14, 48 20, 50 25 C52 20, 56 14, 62 12 C76 6, 90 15, 90 30 C90 50, 70 65, 50 78 Z"
              fill="url(#ribbonGrad1)"
            />

            {/* Inner Overlapping 3D Ribbon Twist Shadow */}
            <path
              d="M50 78 C35 68, 20 54, 20 34 C20 22, 30 14, 40 18 C46 20, 48 24, 50 30 C52 24, 54 20, 60 18 C70 14, 80 22, 80 34 C80 54, 65 68, 50 78 Z"
              fill="url(#ribbonGrad2)"
              opacity="0.85"
            />

            {/* Inner Core Heart Highlight */}
            <path
              d="M50 72 C40 63, 28 50, 28 36 C28 26, 35 20, 43 23 C47 25, 49 28, 50 32 C51 28, 53 25, 57 23 C65 20, 72 26, 72 36 C72 50, 60 63, 50 72 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Text Container with Flowing Underline & Leaf */}
        <div className="flex flex-col relative justify-center pt-0.5">
          <div className="flex items-baseline">
            <span className={`font-black ${dim.textClass} tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#0B192C]'}`}>
              Fund
            </span>
            <span className={`font-black ${dim.textClass} tracking-tight leading-none ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent'
            }`}>
              Flow
            </span>
          </div>

          {/* Subtitle Text - Highly Visible & Crisp on White Background */}
          <span className={`font-extrabold ${dim.subClass} uppercase tracking-[0.22em] mt-1 whitespace-nowrap ${
            isDark ? 'text-emerald-400/90' : 'text-slate-700'
          }`}>
            COMMUNITY-POWERED GROWTH
          </span>

          {/* Wave Underline Extension with Sprouting Leaf */}
          <svg
            className="w-full h-3 overflow-visible mt-0.5"
            viewBox="0 0 160 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Smooth Wave Line */}
            <path
              d="M 0 4 Q 50 14, 135 5"
              stroke={isDark ? "url(#ribbonGrad2)" : "url(#ribbonGrad1)"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Sprouting Double Leaf Motif at right edge */}
            <g transform="translate(136, 1)">
              {/* Leaf 1 */}
              <path
                d="M 0 6 C 3 0, 9 0, 12 3 C 9 8, 3 8, 0 6 Z"
                fill="url(#leafGrad)"
              />
              {/* Leaf 2 */}
              <path
                d="M 2 7 C 7 4, 12 7, 13 11 C 9 12, 4 10, 2 7 Z"
                fill="url(#leafGrad)"
              />
            </g>
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
