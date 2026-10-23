import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow focus:ring-indigo-500 border border-transparent',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-indigo-500',
    dark:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-700 border border-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500 border border-transparent',
    warning:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-sm focus:ring-amber-400 border border-transparent',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 border border-transparent',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent focus:ring-slate-400',
    outline:
      'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 gap-1',
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 text-current shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 text-current shrink-0" />
      )}
    </button>
  );
};

export default Button;
