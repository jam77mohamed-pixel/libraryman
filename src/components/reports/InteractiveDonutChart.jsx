import React, { useState } from 'react';

const PALETTE = [
  { stroke: '#6366f1', fill: '#4f46e5', light: '#e0e7ff', name: 'Indigo' },
  { stroke: '#10b981', fill: '#059669', light: '#d1fae5', name: 'Emerald' },
  { stroke: '#f59e0b', fill: '#d97706', light: '#fef3c7', name: 'Amber' },
  { stroke: '#ec4899', fill: '#db2777', light: '#fce7f3', name: 'Pink' },
  { stroke: '#8b5cf6', fill: '#7c3aed', light: '#ede9fe', name: 'Purple' },
  { stroke: '#06b6d4', fill: '#0891b2', light: '#cffafe', name: 'Cyan' },
  { stroke: '#f97316', fill: '#ea580c', light: '#ffedd5', name: 'Orange' },
];

const InteractiveDonutChart = ({ categories = [], books = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Group books by category
  const data = categories.map((cat, idx) => {
    const count = books.filter((b) => b.category === cat.name).length;
    const theme = PALETTE[idx % PALETTE.length];
    return {
      name: cat.name,
      count,
      color: theme.stroke,
      fill: theme.fill,
      light: theme.light,
    };
  });

  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  // SVG parameters
  const size = 260;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Compute strokeDasharray and strokeDashoffset for each slice safely
  let accumulated = 0;
  const slices = [];
  for (let idx = 0; idx < data.length; idx++) {
    const item = data[idx];
    const percent = item.count / total;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulated * circumference;
    accumulated += percent;

    slices.push({
      ...item,
      percent: (percent * 100).toFixed(1),
      strokeDasharray,
      strokeDashoffset,
      idx,
    });
  }

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="flex flex-col items-center">
      {/* Visual SVG Donut */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 drop-shadow-sm"
        >
          {/* Base background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.idx;
            return (
              <circle
                key={slice.name}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(slice.idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${slice.color}80)` : 'none',
                }}
              />
            );
          })}
        </svg>

        {/* Center Readout Card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          {activeSlice ? (
            <div className="animate-in fade-in zoom-in-95 duration-150">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full mb-1"
                style={{ backgroundColor: activeSlice.color }}
              />
              <span className="block text-2xl font-black text-slate-900 leading-tight">
                {activeSlice.count}
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {activeSlice.percent}% of Catalog
              </span>
              <span className="block text-xs font-semibold text-slate-700 max-w-[120px] truncate mt-0.5">
                {activeSlice.name}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-3xl font-black text-slate-900 block leading-tight">
                {total}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Total Titles
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Hover slice to inspect
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Colorful Interactive Legend Chips */}
      <div className="mt-5 grid grid-cols-2 gap-2 w-full max-w-sm">
        {slices.map((slice) => {
          const isSelected = hoveredIndex === slice.idx;
          return (
            <div
              key={slice.name}
              onMouseEnter={() => setHoveredIndex(slice.idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'border-indigo-400 bg-indigo-50/80 shadow-xs scale-[1.02]'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-xs font-medium text-slate-700 truncate">
                  {slice.name}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 shrink-0">
                {slice.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveDonutChart;
