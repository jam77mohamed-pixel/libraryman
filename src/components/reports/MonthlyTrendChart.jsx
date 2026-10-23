import React, { useState } from 'react';

const MONTHS_DATA = [
  { month: 'Nov', issued: 42, returned: 38 },
  { month: 'Dec', issued: 56, returned: 50 },
  { month: 'Jan', issued: 68, returned: 62 },
  { month: 'Feb', issued: 74, returned: 69 },
  { month: 'Mar', issued: 88, returned: 78 },
  { month: 'Apr', issued: 65, returned: 60 },
  { month: 'May', issued: 78, returned: 75 },
  { month: 'Jun', issued: 92, returned: 86 },
  { month: 'Jul', issued: 84, returned: 80 },
  { month: 'Aug', issued: 95, returned: 89 },
  { month: 'Sep', issued: 110, returned: 102 },
  { month: 'Oct', issued: 124, returned: 114 },
];

const MonthlyTrendChart = ({ data = MONTHS_DATA }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxVal = Math.max(...data.map((d) => Math.max(d.issued, d.returned))) * 1.15;
  const chartHeight = 200;

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 mb-4 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
          <span>Books Issued</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
          <span>Books Returned</span>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative pt-6">
        {/* Tooltip */}
        {hoveredIdx !== null && (
          <div className="absolute top-0 right-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-3 z-10 animate-in fade-in duration-100">
            <span className="font-semibold text-slate-200">{data[hoveredIdx].month}:</span>
            <span className="text-indigo-300">Issued: {data[hoveredIdx].issued}</span>
            <span className="text-emerald-300">Returned: {data[hoveredIdx].returned}</span>
          </div>
        )}

        {/* Bars Container */}
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-52 px-2 border-b border-slate-200">
          {data.map((item, idx) => {
            const issuedHeight = (item.issued / maxVal) * chartHeight;
            const returnedHeight = (item.returned / maxVal) * chartHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                  {/* Issued bar */}
                  <div
                    className={`w-2.5 sm:w-4 rounded-t-sm transition-all duration-300 ${
                      isHovered ? 'bg-indigo-500 scale-y-105' : 'bg-indigo-600'
                    }`}
                    style={{ height: `${issuedHeight}px` }}
                  />
                  {/* Returned bar */}
                  <div
                    className={`w-2.5 sm:w-4 rounded-t-sm transition-all duration-300 ${
                      isHovered ? 'bg-emerald-400 scale-y-105' : 'bg-emerald-500'
                    }`}
                    style={{ height: `${returnedHeight}px` }}
                  />
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium transition-colors ${
                    isHovered ? 'text-indigo-600 font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;
