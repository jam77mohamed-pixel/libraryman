import React from 'react';

/**
 * Unique bespoke logo for Athenaeum Library:
 * An architectural classical library arch with an illuminated open book
 * and radiant star of knowledge in rich royal indigo, violet, and warm gold.
 */
const LibraryLogo = ({ size = 'md', className = '', showText = true, isDark = false }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 24, font: 'text-sm' },
    md: { box: 'w-10 h-10', svg: 30, font: 'text-base' },
    lg: { box: 'w-14 h-14', svg: 42, font: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Bespoke Emblem */}
      <div
        className={`${currentSize.box} rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
      >
        <div className="w-full h-full bg-slate-950/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5"
          >
            <defs>
              <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="bookWhite" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>

            {/* Architectural Arch Pillars */}
            <path
              d="M6 30V15C6 8.37 11.37 3 18 3C24.63 3 30 8.37 30 15V30"
              stroke="url(#goldGlow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 3"
              opacity="0.85"
            />

            {/* Open Book Wings */}
            <path
              d="M7 26.5C11.5 24.5 15.5 25 18 27.5C20.5 25 24.5 24.5 29 26.5V13.5C24.5 11.5 20.5 12 18 14.5C15.5 12 11.5 11.5 7 13.5V26.5Z"
              fill="url(#bookWhite)"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />

            {/* Book Spine Center Line */}
            <path
              d="M18 14.5V27.5"
              stroke="#f97316"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Radiant Knowledge Star */}
            <circle cx="18" cy="8" r="2.2" fill="url(#goldGlow)" />
            <path
              d="M18 3.5V5M18 11V12.5M13.5 8H15M21 8H22.5"
              stroke="url(#goldGlow)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              } ${currentSize.font}`}
            >
              Athenaeum
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <p
            className={`text-[11px] font-semibold tracking-wide ${
              isDark ? 'text-amber-300' : 'text-orange-600'
            }`}
          >
            Central Library
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryLogo;
