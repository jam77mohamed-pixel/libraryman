import React, { useState } from 'react';
import { BookOpen, Sparkles, Feather, Cpu, Compass, Landmark, Lightbulb } from 'lucide-react';

const categoryThemes = {
  'Computer Science & Tech': {
    gradient: 'from-blue-600 via-indigo-700 to-slate-900',
    accent: '#38bdf8',
    icon: Cpu,
    pattern: 'TECH',
  },
  'Fiction & Literature': {
    gradient: 'from-purple-700 via-fuchsia-800 to-rose-950',
    accent: '#f472b6',
    icon: Feather,
    pattern: 'LIT',
  },
  'Business & Leadership': {
    gradient: 'from-emerald-700 via-teal-800 to-slate-900',
    accent: '#34d399',
    icon: Compass,
    pattern: 'BIZ',
  },
  'Science & Nature': {
    gradient: 'from-cyan-700 via-sky-800 to-indigo-950',
    accent: '#38bdf8',
    icon: Sparkles,
    pattern: 'SCI',
  },
  'History & Biography': {
    gradient: 'from-amber-700 via-orange-800 to-stone-950',
    accent: '#fbbf24',
    icon: Landmark,
    pattern: 'HIST',
  },
  'Philosophy & Psychology': {
    gradient: 'from-rose-700 via-red-800 to-amber-950',
    accent: '#fca5a5',
    icon: Lightbulb,
    pattern: 'PHIL',
  },
};

const BookCover = ({
  src,
  title = 'Library Book',
  author = 'Author',
  category = 'General Collection',
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
}) => {
  const [imageError, setImageError] = useState(false);

  const theme = categoryThemes[category] || {
    gradient: 'from-indigo-600 via-violet-700 to-slate-900',
    accent: '#fbbf24',
    icon: BookOpen,
    pattern: 'BOOK',
  };

  const Icon = theme.icon;

  const sizeClasses = {
    sm: 'w-10 h-14 text-[9px]',
    md: 'w-full h-full text-xs',
    lg: 'w-full h-80 text-sm',
  };

  // If valid image provided and no error, render image with realistic physical book effects
  if (src && !imageError) {
    return (
      <div className={`relative overflow-hidden rounded-lg shadow-md group ${className}`}>
        {/* Book spine lighting overlay */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/15 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1.5 bg-black/15 z-10 pointer-events-none" />
        
        <img
          src={src}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    );
  }

  // Stylish, colorful bespoke illustrated Book Jacket fallback
  return (
    <div
      className={`relative rounded-lg shadow-md overflow-hidden bg-gradient-to-br ${theme.gradient} text-white p-3 flex flex-col justify-between select-none ${className}`}
    >
      {/* Physical book spine 3D effect */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/50 via-white/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1.5 bg-black/20 z-10 pointer-events-none" />

      {/* Decorative background watermark */}
      <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
        <Icon className="w-32 h-32" />
      </div>

      {/* Top Header of book cover */}
      <div className="relative z-10 pl-2">
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded backdrop-blur-md bg-white/15 text-white/90"
            style={{ color: theme.accent }}
          >
            {category}
          </span>
          <Icon className="w-3.5 h-3.5 text-white/70" />
        </div>
      </div>

      {/* Title & Author Center */}
      <div className="relative z-10 pl-2 my-auto py-2">
        <div className="w-6 h-0.5 mb-1.5 opacity-80" style={{ backgroundColor: theme.accent }} />
        <h4 className="font-extrabold text-white leading-tight line-clamp-3 text-xs sm:text-sm drop-shadow-sm">
          {title}
        </h4>
        <p className="text-[11px] font-medium text-white/80 mt-1 line-clamp-1 italic">
          {author}
        </p>
      </div>

      {/* Bottom Imprint & Barcode styling */}
      <div className="relative z-10 pl-2 flex items-center justify-between pt-1 border-t border-white/15">
        <span className="text-[8px] font-mono tracking-widest text-white/60 uppercase">
          ATHENAEUM PRESS
        </span>
        <div className="flex gap-0.5 opacity-60">
          <div className="w-0.5 h-3 bg-white" />
          <div className="w-1 h-3 bg-white" />
          <div className="w-0.5 h-3 bg-white" />
          <div className="w-1.5 h-3 bg-white" />
          <div className="w-0.5 h-3 bg-white" />
        </div>
      </div>
    </div>
  );
};

export default BookCover;
