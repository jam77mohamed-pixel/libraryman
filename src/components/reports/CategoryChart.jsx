import React, { useState } from 'react';

const CategoryChart = ({ categories = [], books = [] }) => {
  const [hoveredCat, setHoveredCat] = useState(null);

  // Calculate book count per category
  const data = categories.map((cat) => {
    const count = books.filter((b) => b.category === cat.name).length;
    return {
      id: cat.id,
      name: cat.name,
      count,
      color: cat.color || 'indigo',
    };
  });

  const totalBooks = data.reduce((sum, d) => sum + d.count, 0) || 1;
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const colorMap = {
    indigo: '#4f46e5',
    purple: '#9333ea',
    emerald: '#10b981',
    cyan: '#06b6d4',
    amber: '#f59e0b',
    rose: '#f43f5e',
    sky: '#0284c7',
    teal: '#0d9488',
  };

  return (
    <div className="space-y-4">
      {/* Visual horizontal bars with exact distribution */}
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = ((item.count / totalBooks) * 100).toFixed(1);
          const barWidth = Math.max(4, (item.count / maxCount) * 100);
          const fillHex = colorMap[item.color] || '#4f46e5';
          const isHovered = hoveredCat === item.id;

          return (
            <div
              key={item.id}
              className={`p-2 rounded-xl transition-all duration-150 ${
                isHovered ? 'bg-slate-50' : ''
              }`}
              onMouseEnter={() => setHoveredCat(item.id)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: fillHex }}
                  />
                  {item.name}
                </span>
                <span className="text-slate-500 font-medium">
                  {item.count} {item.count === 1 ? 'book' : 'books'} ({percentage}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: fillHex,
                    opacity: hoveredCat && !isHovered ? 0.4 : 1,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Across {categories.length} Catalog Categories</span>
        <span className="font-semibold text-slate-800">{totalBooks} Total Cataloged Books</span>
      </div>
    </div>
  );
};

export default CategoryChart;
