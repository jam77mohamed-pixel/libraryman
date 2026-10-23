import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const SUNSET_CORAL_THEME = {
  id: 'sunset',
  name: 'Sunset Coral',
  desc: 'Roasted espresso plum sidebar with warm mango & peach sunrise canvas',
  tag: 'Sunset Coral',
  lightSidebar: false,
  isDark: false,
  bgClass: 'bg-orange-50/50',
  sidebarClass: 'bg-gradient-to-b from-[#25091a] via-[#380e28] to-[#1a0512] border-orange-900/40 text-orange-100',
  sidebarActive: 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/35 font-bold',
  sidebarBrandText: 'text-white',
  headerClass: 'bg-[#fffbf6]/90 border-orange-100 text-slate-900 backdrop-blur-md',
  cardClass: 'bg-white border-orange-200/80 text-slate-900 shadow-xs shadow-orange-500/5',
  accentDot: 'bg-orange-500',
  swatchColors: ['#380e28', '#f97316', '#fff7ed'],
};

export const THEMES = {
  sunset: SUNSET_CORAL_THEME,
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Dedicated Sunset Coral theme for the entire application
    document.body.className = 'theme-sunset text-slate-900';
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: SUNSET_CORAL_THEME,
        themeId: 'sunset',
        themes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
