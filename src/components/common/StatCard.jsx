import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const colorThemes = {
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600',
    border: 'border-indigo-100',
    ring: 'group-hover:border-indigo-300',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-100',
    ring: 'group-hover:border-emerald-300',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
    ring: 'group-hover:border-amber-300',
  },
  rose: {
    bg: 'bg-rose-50 text-rose-600',
    border: 'border-rose-100',
    ring: 'group-hover:border-rose-300',
  },
  purple: {
    bg: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100',
    ring: 'group-hover:border-purple-300',
  },
  cyan: {
    bg: 'bg-cyan-50 text-cyan-600',
    border: 'border-cyan-100',
    ring: 'group-hover:border-cyan-300',
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  subtitle,
  trend,
  trendDirection = 'up',
  onClick,
  className = '',
}) => {
  const cardColor = colorThemes[color] || colorThemes.indigo;
  const { theme: appTheme } = useTheme();
  const cardStyle = appTheme?.cardClass || 'bg-white border-slate-200/90 text-slate-900 shadow-xs';

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${cardStyle} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${cardColor.bg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-black/5 dark:border-white/10 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold ${
                trendDirection === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trendDirection === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend}
            </span>
          )}
          {subtitle && <span className="opacity-70 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
