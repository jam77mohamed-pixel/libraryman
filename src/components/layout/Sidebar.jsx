import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Repeat,
  DollarSign,
  Tag,
  BarChart3,
  Search,
  LogOut,
  X,
  BookMarked,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { useTheme } from '../../context/ThemeContext';
import LibraryLogo from '../common/LibraryLogo';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { stats } = useLibrary();
  const { theme } = useTheme();

  const isDarkSidebar = true;

  const navItems = [
    {
      name: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      iconColor: isDarkSidebar ? 'text-violet-400' : 'text-violet-600',
    },
    {
      name: 'Book Catalog',
      path: '/books',
      icon: BookOpen,
      iconColor: isDarkSidebar ? 'text-cyan-400' : 'text-cyan-600',
      badge: stats.totalBooks > 0 ? stats.totalBooks : null,
      badgeColor: isDarkSidebar
        ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-700/50'
        : 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    },
    {
      name: 'Cardholders',
      path: '/members',
      icon: Users,
      iconColor: isDarkSidebar ? 'text-emerald-400' : 'text-emerald-600',
      badge: stats.totalMembers > 0 ? stats.totalMembers : null,
      badgeColor: isDarkSidebar
        ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/50'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      name: 'Circulation Desk',
      path: '/circulation',
      icon: Repeat,
      iconColor: isDarkSidebar ? 'text-amber-400' : 'text-amber-600',
      badge: stats.booksIssued > 0 ? `${stats.booksIssued} out` : null,
      badgeColor: isDarkSidebar
        ? 'bg-amber-900/80 text-amber-200 border border-amber-700/50'
        : 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      name: 'Fine & Dues',
      path: '/fines',
      icon: DollarSign,
      iconColor: isDarkSidebar ? 'text-rose-400' : 'text-rose-600',
      badge: stats.overdueBooks > 0 ? `${stats.overdueBooks} due` : null,
      badgeColor: isDarkSidebar
        ? 'bg-rose-900/80 text-rose-200 border border-rose-700/50'
        : 'bg-rose-50 text-rose-700 border border-rose-200',
    },
    {
      name: 'Genres & Topics',
      path: '/categories',
      icon: Tag,
      iconColor: isDarkSidebar ? 'text-pink-400' : 'text-pink-600',
    },
    {
      name: 'Library Analytics',
      path: '/reports',
      icon: BarChart3,
      iconColor: isDarkSidebar ? 'text-cyan-400' : 'text-cyan-600',
    },
    {
      name: 'Universal Search',
      path: '/search',
      icon: Search,
      iconColor: isDarkSidebar ? 'text-sky-400' : 'text-sky-600',
    },
  ];

  const sidebarContent = (
    <div
      className={`flex flex-col h-full border-r transition-colors duration-300 ${theme.sidebarClass}`}
    >
      {/* Brand Header */}
      <div
        className={`h-20 px-6 flex items-center justify-between border-b relative transition-colors ${
          isDarkSidebar ? 'border-white/10 bg-black/20' : 'border-slate-100 bg-white'
        }`}
      >
        <NavLink to="/" onClick={onCloseMobile} className="group">
          <LibraryLogo size="md" isDark={isDarkSidebar} />
        </NavLink>

        {/* 5-Color Subtle Underline */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 via-emerald-400 via-amber-400 to-rose-500 opacity-80" />

        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className={`lg:hidden p-1.5 rounded-xl cursor-pointer ${
              isDarkSidebar
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <div
          className={`px-3 mb-2 text-[10px] font-black uppercase tracking-widest ${
            isDarkSidebar ? 'text-white/40' : 'text-slate-400'
          }`}
        >
          Library Services
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 group ${
                  isActive
                    ? theme.sidebarActive
                    : isDarkSidebar
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-white' : item.iconColor
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Library Status Pill */}
      <div
        className={`px-4 py-3 mx-4 mb-3 rounded-2xl border transition-colors ${
          isDarkSidebar
            ? 'bg-white/5 border-white/10 text-white'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/80 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isDarkSidebar ? 'bg-amber-400 text-slate-950 font-black' : 'bg-amber-500 text-white'
            }`}
          >
            <BookMarked className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span
              className={`font-extrabold block ${
                isDarkSidebar ? 'text-amber-300' : 'text-amber-900'
              }`}
            >
              Library Open
            </span>
            <p className={`text-[11px] font-medium ${isDarkSidebar ? 'text-white/60' : 'text-amber-700'}`}>
              Reading Rooms Active
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      {user && (
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 transition-colors ${
            isDarkSidebar
              ? 'border-white/10 bg-black/30 text-white'
              : 'border-slate-100 bg-slate-50/70 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-indigo-400 shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <p
                className={`text-xs font-bold truncate ${
                  isDarkSidebar ? 'text-white' : 'text-slate-900'
                }`}
              >
                {user.name}
              </p>
              <p className="text-[11px] text-indigo-400 font-semibold truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
              isDarkSidebar
                ? 'text-white/50 hover:text-rose-400 hover:bg-white/10'
                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
