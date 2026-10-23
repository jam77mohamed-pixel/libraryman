import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  BookOpen,
  UserPlus,
  Repeat,
  AlertTriangle,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Header = ({ onOpenMobileSidebar, onOpenIssueModal, onOpenAddBookModal, onOpenAddMemberModal }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { issues, stats } = useLibrary();
  const { theme } = useTheme();

  const isDark = !!theme?.isDark;

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const quickRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setShowQuickActions(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const overdueIssues = issues.filter((iss) => iss.status === 'Overdue');

  return (
    <header
      className={`relative h-16 backdrop-blur-md border-b sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-300 ${theme.headerClass}`}
    >
      {/* Sunset Coral Horizon Accent Ribbon */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 shadow-xs shadow-orange-500/25 pointer-events-none" />

      {/* Left: Mobile Toggle & Universal Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl cursor-pointer text-slate-600 hover:bg-orange-50"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, authors, categories, or members..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white border border-orange-200/90 text-slate-900 placeholder-slate-400 focus:bg-white shadow-2xs"
          />
        </form>
      </div>

      {/* Right: Quick actions, notifications, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button & Menu */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 shadow-md shadow-orange-300/30 cursor-pointer transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Action</span>
          </button>

          {showQuickActions && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border p-2 z-40 animate-in fade-in zoom-in-95 duration-100 ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  if (onOpenIssueModal) onOpenIssueModal();
                  else navigate('/circulation');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-amber-500/10 flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block group-hover:text-amber-500">
                    Lend a Book
                  </span>
                  <span className="text-[11px] text-slate-400">Record member checkout</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowQuickActions(false);
                  if (onOpenAddBookModal) onOpenAddBookModal();
                  else navigate('/books');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-500/10 flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block group-hover:text-indigo-500">
                    Catalog New Book
                  </span>
                  <span className="text-[11px] text-slate-400">Place book on shelf</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowQuickActions(false);
                  if (onOpenAddMemberModal) onOpenAddMemberModal();
                  else navigate('/members');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-500/10 flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block group-hover:text-emerald-500">
                    Enroll Cardholder
                  </span>
                  <span className="text-[11px] text-slate-400">Register new member</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Circulation Notices"
          >
            <Bell className="w-5 h-5" />
            {overdueIssues.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100 ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/60 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Overdue Notices
                </span>
                <span className="text-xs bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                  {overdueIssues.length} Items
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {overdueIssues.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    All borrowings are within due dates. No overdue loans!
                  </div>
                ) : (
                  overdueIssues.slice(0, 5).map((iss) => (
                    <div
                      key={iss.id}
                      className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/fines');
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          Overdue: {iss.bookTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Borrowed by {iss.memberName} (Due: {formatDate(iss.returnDueDate)})
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-1.5 py-0.5 rounded">
                          Penalty: {formatCurrency(iss.fineAmount)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/fines');
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  View All Fines & Loans →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        {user && (
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 p-1 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400 shadow-xs"
              />
              <span className="hidden md:block text-xs font-bold max-w-[110px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border p-2 z-40 animate-in fade-in zoom-in-95 duration-100 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                }`}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Overview</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
