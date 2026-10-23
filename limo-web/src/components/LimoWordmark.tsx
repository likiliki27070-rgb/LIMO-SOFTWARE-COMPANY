'use client';

import React from 'react';
import Link from 'next/link';

interface LimoWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function LimoWordmark({
  className = '',
  size = 'md',
  showSubtitle = true,
}: LimoWordmarkProps) {
  const sizeMap = {
    sm: { symbol: 24, font: 'text-xl', sub: 'text-[9px]' },
    md: { symbol: 32, font: 'text-2xl', sub: 'text-[10px]' },
    lg: { symbol: 42, font: 'text-4xl', sub: 'text-xs' },
  };

  const { symbol, font, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Geometric SVG Icon */}
      <div className="relative flex items-center justify-center">
        <svg
          width={symbol}
          height={symbol}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Subtle glow / back shadow */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="10"
            fill="url(#limo_base_gradient)"
          />
          {/* Distinctive geometric 'L' and polygon motif */}
          <path
            d="M12 10V28C12 29.1046 12.8954 30 14 30H28"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12L28 20L20 28"
            stroke="#00D2FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="12" r="3" fill="#00D2FF" />

          <defs>
            <linearGradient
              id="limo_base_gradient"
              x1="0"
              y1="0"
              x2="40"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0066FF" />
              <stop offset="1" stopColor="#0A192F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${font} text-limo-navy dark:text-white`}
          >
            LIMO
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-limo-cyan animate-pulse" />
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-0.5 ${sub}`}
          >
            Software & Talent
          </span>
        )}
      </div>
    </div>
  );
}
