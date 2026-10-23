import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  Tag,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  BookMarked,
  Layers,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import InteractiveDonutChart from '../../components/reports/InteractiveDonutChart';
import CirculationAreaChart from '../../components/reports/CirculationAreaChart';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { books, members, issues, categories, fines, activities, stats, loadingBooks } = useLibrary();
  const { openIssueModal, openAddBookModal, openAddMemberModal } = useOutletContext() || {};

  const overdueIssues = issues.filter((iss) => iss.status === 'Overdue');

  const quickActions = [
    {
      title: 'Lend a Book',
      desc: 'Check out book to cardholder',
      icon: Repeat,
      gradient: 'from-amber-500 to-orange-500',
      action: () => (openIssueModal ? openIssueModal() : navigate('/circulation')),
    },
    {
      title: 'Catalog New Book',
      desc: 'Place new accession on shelf',
      icon: BookOpen,
      gradient: 'from-indigo-600 via-indigo-700 to-violet-600',
      action: () => (openAddBookModal ? openAddBookModal() : navigate('/books')),
    },
    {
      title: 'Enroll Cardholder',
      desc: 'Register new reader account',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      action: () => (openAddMemberModal ? openAddMemberModal() : navigate('/members')),
    },
    {
      title: 'Collect Overdue Fine',
      desc: 'Process penalty settlements',
      icon: DollarSign,
      gradient: 'from-rose-500 to-pink-600',
      action: () => navigate('/fines'),
    },
  ];

  const getActivityBadge = (type) => {
    switch (type) {
      case 'issue':
        return <Badge variant="warning">Lent</Badge>;
      case 'return':
        return <Badge variant="success">Returned</Badge>;
      case 'fine_paid':
        return <Badge variant="primary">Paid Fine</Badge>;
      case 'book_add':
        return <Badge variant="purple">Cataloged</Badge>;
      case 'member_add':
        return <Badge variant="info">Enrolled</Badge>;
      default:
        return <Badge variant="default">Activity</Badge>;
    }
  };

  return (
    <div className="space-y-7">
      {/* Welcome Banner with Colorful Gradients & Library Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20">
        {/* Colorful glowing ambient orbs */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -mb-16 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Athenaeum Central Reading & Lending Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Welcome, {user?.name || 'Librarian'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore your library collection, manage active borrower checkouts, and review
              circulation statistics in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => (openIssueModal ? openIssueModal() : navigate('/circulation'))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 cursor-pointer transition-all duration-150"
            >
              <Repeat className="w-4 h-4 text-slate-950" />
              <span>Lend a Book</span>
            </button>
            <button
              onClick={() => navigate('/books')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm cursor-pointer transition-all duration-150"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Colorful Metric Stat Cards Grid */}
      {loadingBooks ? (
        <SkeletonLoader type="stat" count={7} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/books')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-white border border-indigo-100/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Total Books
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                  {stats.totalBooks}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-300 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 pt-2 border-t border-indigo-50">
              {stats.totalBookCopies} physical copies shelved
            </p>
          </div>

          <div
            onClick={() => navigate('/members')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-white border border-emerald-100/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Registered Readers
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                  {stats.totalMembers}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-300 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 pt-2 border-t border-emerald-50">
              {stats.activeMembers} active cardholders
            </p>
          </div>

          <div
            onClick={() => navigate('/circulation')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-100/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Books on Loan
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                  {stats.booksIssued}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-300 group-hover:scale-105 transition-transform">
                <Repeat className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 pt-2 border-t border-amber-50">
              Currently with borrowers
            </p>
          </div>

          <div
            onClick={() => navigate('/books')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 via-white to-white border border-cyan-100/90 shadow-xs hover:shadow-md hover:border-cyan-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                  Available on Shelf
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                  {stats.booksAvailable}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-300 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 pt-2 border-t border-cyan-50">
              Ready for checkout
            </p>
          </div>

          <div
            onClick={() => navigate('/fines')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-white border border-rose-100/90 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Overdue Borrowings
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-rose-600">
                  {stats.overdueBooks}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-300 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-rose-500 pt-2 border-t border-rose-50 font-medium">
              Requires return attention
            </p>
          </div>

          <div
            onClick={() => navigate('/categories')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-white border border-purple-100/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Genres & Topics
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                  {stats.totalCategories}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-300 group-hover:scale-105 transition-transform">
                <Tag className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 pt-2 border-t border-purple-50">
              Classified disciplines
            </p>
          </div>

          <div
            onClick={() => navigate('/fines')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-white border border-emerald-100/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Fines Collected
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600">
                  {formatCurrency(stats.totalFineCollected)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-300 group-hover:scale-105 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-50 flex items-center justify-between text-xs text-slate-500">
              <span>Settled in treasury</span>
              <span className="font-bold text-rose-600">
                Pending: {formatCurrency(stats.pendingFines)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Cards with Vibrant Gradients */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Quick Lending Actions</span>
          <span className="text-xs text-slate-400 font-normal">One-touch desk operations</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <div
                key={qa.title}
                onClick={qa.action}
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${qa.gradient} flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {qa.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{qa.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            );
          })}
        </div>
      </div>

      {/* UNIQUE CHARTS & VISUALIZATIONS IN DASHBOARD (User explicitly requested!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circulation Curve Graph (7 Cols) */}
        <div className="lg:col-span-7">
          <Card
            title="Circulation Trends & Lending Flow"
            subtitle="12-Month comparison of books borrowed versus books returned"
            action={
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
              >
                <span>Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <CirculationAreaChart />
          </Card>
        </div>

        {/* Unique Interactive Donut / Pie Chart (5 Cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Genre & Category Share"
            subtitle="Catalog distribution across literary classifications"
            action={
              <button
                onClick={() => navigate('/categories')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <InteractiveDonutChart categories={categories} books={books} />
          </Card>
        </div>
      </div>

      {/* Bottom Row: Recent Activities & Overdue Book Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities Timeline */}
        <Card
          title="Recent Circulation Log"
          subtitle="Real-time log of borrowing, returns and reader enrollments"
          action={
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Active Registry
            </span>
          }
        >
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No recent activities recorded.</p>
            ) : (
              activities.slice(0, 8).map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getActivityBadge(act.type)}
                      <span className="font-bold text-slate-800">{act.title}</span>
                    </div>
                    <p className="text-slate-600 pl-1">{act.description}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {formatDate(act.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Overdue Items Spotlight */}
        <Card
          title="Overdue Items Requiring Follow-Up"
          subtitle={`${overdueIssues.length} items currently exceeding return due dates`}
          action={
            <button
              onClick={() => navigate('/fines')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              All Dues →
            </button>
          }
        >
          <div className="space-y-3">
            {overdueIssues.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">All books in circulation are on time!</p>
                <p className="text-slate-400 mt-0.5">No overdue loans currently recorded.</p>
              </div>
            ) : (
              overdueIssues.slice(0, 5).map((iss) => (
                <div
                  key={iss.id}
                  className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{iss.bookTitle}</p>
                    <p className="text-[11px] text-slate-600">
                      Borrower: <span className="font-bold text-slate-800">{iss.memberName}</span>{' '}
                      ({iss.membershipId})
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">
                        Due: {formatDate(iss.returnDueDate)}
                      </span>
                      <span className="text-[10px] font-black text-rose-600">
                        Penalty: {formatCurrency(iss.fineAmount)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => navigate('/circulation')}
                  >
                    Accept Return
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
