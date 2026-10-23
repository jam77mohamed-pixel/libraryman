import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPadding = false,
  footer,
}) => {
  const { theme } = useTheme();
  const cardStyle = theme?.cardClass || 'bg-white border-slate-200/90 text-slate-900 shadow-xs';

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${cardStyle} ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-bold">{title}</h3>}
            {subtitle && <p className="text-xs opacity-70 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-6'}>{children}</div>

      {footer && (
        <div className="px-6 py-3 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/10 text-sm opacity-80">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
