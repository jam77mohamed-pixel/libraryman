import React, { useState, useMemo } from 'react';
import {
  Repeat,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Users,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import IssueBookModal from './IssueBookModal';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';

const IssueReturn = () => {
  const { issues, returnBook } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, Active, Overdue, Returned
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [returningId, setReturningId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        iss.bookTitle?.toLowerCase().includes(term) ||
        iss.memberName?.toLowerCase().includes(term) ||
        iss.membershipId?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || iss.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [issues, searchTerm, statusFilter]);

  // Paginated issues
  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredIssues.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredIssues, currentPage, itemsPerPage]);

  const handleReturnBook = async (issueId) => {
    try {
      setReturningId(issueId);
      const result = await returnBook(issueId);
      if (result.fineRecord) {
        toast.warning(
          `Book returned. An overdue fine of ${formatCurrency(result.fineRecord.amount)} was assessed.`
        );
      } else {
        toast.success('Book returned successfully in good order!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to process book return.');
    } finally {
      setReturningId(null);
    }
  };

  const activeCount = issues.filter((i) => i.status === 'Active').length;
  const overdueCount = issues.filter((i) => i.status === 'Overdue').length;
  const returnedCount = issues.filter((i) => i.status === 'Returned').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Circulation & Loan Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage book checkouts, track return deadlines, update stock availability, and process returns
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsIssueModalOpen(true)}
        >
          Issue New Book
        </Button>
      </div>

      {/* Circulation Counter Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-400'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
            All Transactions
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{issues.length}</span>
        </div>

        <div
          onClick={() => setStatusFilter('Active')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Active'
              ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-400'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-amber-700 font-medium uppercase tracking-wider block">
            Active Loans
          </span>
          <span className="text-2xl font-bold text-amber-900 mt-1 block">{activeCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('Overdue')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Overdue'
              ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-400'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-rose-700 font-medium uppercase tracking-wider block">
            Overdue Loans
          </span>
          <span className="text-2xl font-bold text-rose-900 mt-1 block">{overdueCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('Returned')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Returned'
              ? 'bg-emerald-50/70 border-emerald-300 shadow-xs ring-1 ring-emerald-400'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-emerald-700 font-medium uppercase tracking-wider block">
            Returned Books
          </span>
          <span className="text-2xl font-bold text-emerald-900 mt-1 block">{returnedCount}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by book title, member name, or card ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          {['all', 'Active', 'Overdue', 'Returned'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Circulation Ledger Table */}
      {paginatedIssues.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No circulation records found"
          description="No loan transactions match your current search and filter selections."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Borrower Member</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedIssues.map((iss) => {
                  const isOverdue = iss.status === 'Overdue';
                  const isReturned = iss.status === 'Returned';

                  return (
                    <tr key={iss.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">{iss.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900 max-w-xs truncate">
                          {iss.bookTitle}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-800">{iss.memberName}</p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {iss.membershipId}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{formatDate(iss.issueDate)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            isOverdue ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {formatDate(iss.returnDueDate)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={isOverdue ? 'danger' : isReturned ? 'success' : 'warning'}
                        >
                          {iss.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isReturned ? (
                          <Button
                            variant={isOverdue ? 'danger' : 'primary'}
                            size="xs"
                            isLoading={returningId === iss.id}
                            onClick={() => handleReturnBook(iss.id)}
                          >
                            Return Book
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredIssues.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredIssues.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      )}

      {/* Issue Book Modal */}
      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
      />
    </div>
  );
};

export default IssueReturn;
