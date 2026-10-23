import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

const MONTH_DATA = [
  { month: 'Jan', issued: 48, returned: 42 },
  { month: 'Feb', issued: 62, returned: 54 },
  { month: 'Mar', issued: 75, returned: 68 },
  { month: 'Apr', issued: 59, returned: 55 },
  { month: 'May', issued: 82, returned: 76 },
  { month: 'Jun', issued: 96, returned: 88 },
  { month: 'Jul', issued: 89, returned: 84 },
  { month: 'Aug', issued: 104, returned: 98 },
  { month: 'Sep', issued: 118, returned: 110 },
  { month: 'Oct', issued: 132, returned: 124 },
  { month: 'Nov', issued: 145, returned: 138 },
  { month: 'Dec', issued: 160, returned: 152 },
];

const CirculationAreaChart = ({ data = MONTH_DATA }) => {
  const [hoveredIdx, setHoveredIdx] = useState(data.length - 1);

  // Dimensions
  const width = 640;
  const height = 220;
  const paddingX = 35;
  const paddingY = 25;

  const maxVal = Math.max(...data.map((d) => Math.max(d.issued, d.returned))) * 1.12;

  // Calculate coordinates
  const getX = (index) => paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
  const getY = (val) => height - paddingY - (val / maxVal) * (height - 2 * paddingY);

  // Generate smooth SVG paths
  const makePoints = (key) => data.map((d, i) => `${getX(i)},${getY(d[key])}`).join(' ');

  const makeAreaPath = (key) => {
    const points = data.map((d, i) => `${getX(i)},${getY(d[key])}`);
    const firstX = getX(0);
    const lastX = getX(data.length - 1);
    const bottomY = height - paddingY;
    return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
  };

  const makeLinePath = (key) => {
    const points = data.map((d, i) => `${getX(i)},${getY(d[key])}`);
    return `M ${points.join(' L ')}`;
  };

  const activeItem = data[hoveredIdx];

  return (
    <div className="w-full space-y-3">
      {/* Chart Top Header & Active Hover Summary Card */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xs" />
            <span className="text-xs font-semibold text-slate-700">Books Borrowed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xs" />
            <span className="text-xs font-semibold text-slate-700">Books Returned</span>
          </div>
        </div>

        {activeItem && (
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-md flex items-center gap-3 text-xs animate-in fade-in duration-100">
            <span className="font-bold text-amber-300">{activeItem.month}</span>
            <span className="text-indigo-200">
              Borrowed: <strong className="text-white">{activeItem.issued}</strong>
            </span>
            <span className="text-emerald-200">
              Returned: <strong className="text-white">{activeItem.returned}</strong>
            </span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/60 to-white border border-slate-100 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="issuedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="returnedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glowIndigo" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingY - ratio * (height - 2 * paddingY);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fills */}
          <path d={makeAreaPath('issued')} fill="url(#issuedGrad)" />
          <path d={makeAreaPath('returned')} fill="url(#returnedGrad)" />

          {/* Lines */}
          <path
            d={makeLinePath('issued')}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={makeLinePath('returned')}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points & Hover Targets */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cyIssued = getY(d.issued);
            const cyReturned = getY(d.returned);
            const isHovered = hoveredIdx === i;

            return (
              <g key={d.month} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)}>
                {/* Vertical hover indicator line */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={height - paddingY}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Issued circle */}
                <circle
                  cx={cx}
                  cy={cyIssued}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                  filter={isHovered ? 'url(#glowIndigo)' : 'none'}
                />

                {/* Returned circle */}
                <circle
                  cx={cx}
                  cy={cyReturned}
                  r={isHovered ? 5 : 3.5}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* Invisible hover hotspot */}
                <rect
                  x={cx - 15}
                  y={0}
                  width={30}
                  height={height}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Month labels on X axis */}
          {data.map((d, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <text
                key={d.month}
                x={getX(i)}
                y={height - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered ? 'bold' : 'normal'}
                fill={isHovered ? '#4f46e5' : '#94a3b8'}
                className="select-none transition-colors"
              >
                {d.month}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1 font-medium text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" /> +28% Annual circulation growth
        </span>
        <span>12-Month Lending Throughput</span>
      </div>
    </div>
  );
};

export default CirculationAreaChart;
