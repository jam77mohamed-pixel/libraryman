import React from 'react';
import {
  BarChart3,
  Download,
  Printer,
  BookOpen,
  Users,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  Tag,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import InteractiveDonutChart from '../../components/reports/InteractiveDonutChart';
import CirculationAreaChart from '../../components/reports/CirculationAreaChart';
import BookCover from '../../components/common/BookCover';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';

const Reports = () => {
  const { books, members, issues, categories, fines, stats } = useLibrary();

  // Export CSV summary report
  const handleExportCSV = () => {
    try {
      const rows = [
        ['ATHENAEUM LIBRARY MANAGEMENT REPORT'],
        ['Generated Date', new Date().toLocaleDateString()],
        [''],
        ['EXECUTIVE SUMMARY METRICS'],
        ['Total Book Titles', stats.totalBooks],
        ['Total Book Physical Copies', stats.totalBookCopies],
        ['Total Books Currently Issued', stats.booksIssued],
        ['Total Books Available', stats.booksAvailable],
        ['Overdue Books', stats.overdueBooks],
        ['Books Returned to Date', stats.booksReturned],
        ['Total Registered Members', stats.totalMembers],
        ['Active Cardholders', stats.activeMembers],
        ['Total Categories', stats.totalCategories],
        ['Total Fine Collected', `$${stats.totalFineCollected.toFixed(2)}`],
        ['Pending Overdue Fines', `$${stats.pendingFines.toFixed(2)}`],
        [''],
        ['CATEGORY DISTRIBUTION'],
        ['Category Name', 'Book Count'],
        ...categories.map((c) => [
          c.name,
          books.filter((b) => b.category === c.name).length,
        ]),
        [''],
        ['RECENT CIRCULATION TRANSACTIONS'],
        ['Issue ID', 'Book Title', 'Member Name', 'Issue Date', 'Due Date', 'Status'],
        ...issues.slice(0, 20).map((iss) => [
          iss.id,
          `"${iss.bookTitle.replace(/"/g, '""')}"`,
          iss.memberName,
          iss.issueDate,
          iss.returnDueDate,
          iss.status,
        ]),
      ];

      const csvContent =
        'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `library_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('CSV Report generated and downloaded!');
    } catch (err) {
      toast.error('Failed to export CSV report.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header with Export / Print controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics & Executive Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive library performance metrics, inventory health, and circulation analytics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            className="hidden sm:inline-flex"
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Module 8: Core Required Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Books</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{stats.totalBooks}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">{stats.totalBookCopies} Total copies</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Repeat className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Books Issued</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{stats.booksIssued}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Currently with members</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Books Returned</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{stats.booksReturned}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Safely restituted</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Active Members</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{stats.activeMembers}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Of {stats.totalMembers} enrolled</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Books</span>
          </div>
          <span className="text-2xl font-bold text-rose-600">{stats.overdueBooks}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Pending fine: {formatCurrency(stats.pendingFines)}
          </p>
        </div>
      </div>

      {/* Module 8: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Issue Report Chart */}
        <div className="lg:col-span-7">
          <Card
            title="Monthly Issue & Circulation Report"
            subtitle="Annualized borrowing and return throughput trends"
          >
            <CirculationAreaChart />
          </Card>
        </div>

        {/* Category-wise Book Count */}
        <div className="lg:col-span-5">
          <Card
            title="Category-Wise Book Count"
            subtitle="Catalog distribution across classified genres"
          >
            <InteractiveDonutChart categories={categories} books={books} />
          </Card>
        </div>
      </div>

      {/* Leaderboards and Deep Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Circulated Books */}
        <Card
          title="Most Popular Catalog Titles"
          subtitle="Books with highest borrowing demand"
        >
          <div className="space-y-3">
            {books.slice(0, 5).map((book, idx) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <BookCover
                    src={book.coverImage}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    className="w-8 h-11 shrink-0 shadow-xs"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-slate-900 truncate">{book.title}</p>
                    <p className="text-[11px] text-slate-500">{book.author}</p>
                  </div>
                </div>
                <Badge variant="indigo">{book.category}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Members Activity */}
        <Card
          title="Member Circulation Standing"
          subtitle="Registered patrons and borrowing activities"
        >
          <div className="space-y-3">
            {members.slice(0, 5).map((member) => {
              const activeCount = issues.filter(
                (iss) =>
                  iss.memberId === member.id &&
                  (iss.status === 'Active' || iss.status === 'Overdue')
              ).length;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.fullName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-slate-900 truncate">
                        {member.fullName}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">{member.membershipId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700 block">
                      {activeCount} active loans
                    </span>
                    <Badge variant={member.status === 'Active' ? 'success' : 'danger'}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
