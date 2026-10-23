import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import PayFineModal from './PayFineModal';
import { formatDate, formatCurrency } from '../../utils/formatters';

const FineManagement = () => {
  const { fines, issues, stats } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, Unpaid, Paid, Waived
  const [selectedFineForPayment, setSelectedFineForPayment] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered fines
  const filteredFines = useMemo(() => {
    return fines.filter((fine) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        fine.memberName?.toLowerCase().includes(term) ||
        fine.membershipId?.toLowerCase().includes(term) ||
        fine.bookTitle?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [fines, searchTerm, statusFilter]);

  // Paginated fines
  const paginatedFines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFines.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFines, currentPage, itemsPerPage]);

  const overdueIssues = issues.filter((iss) => iss.status === 'Overdue');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fine & Penalty Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated overdue fine assessment ($1.00/day), payment processing, and audit ledger
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Fines Collected
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1.5">
              {formatCurrency(stats.totalFineCollected)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Settled into library treasury</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
              Pending Unpaid Fines
            </p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1.5">
              {formatCurrency(stats.pendingFines)}
            </h3>
            <p className="text-[11px] text-rose-400 mt-1">Awaiting borrower payment</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
              Overdue Borrowings
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1.5">
              {overdueIssues.length} Items
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Accumulating daily penalties</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Overdue Book Spotlight Card (Module 6 Requirement: Overdue Book List) */}
      {overdueIssues.length > 0 && (
        <Card
          title="Active Overdue Items Requiring Follow-Up"
          subtitle="Books that have crossed their return deadline. Automated daily fees are accruing."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overdueIssues.map((iss) => (
              <div
                key={iss.id}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      OVERDUE
                    </span>
                    <span className="text-xs font-bold text-rose-700">
                      Fine: {formatCurrency(iss.fineAmount)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-900 mt-2 truncate">
                    {iss.bookTitle}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Cardholder: {iss.memberName} ({iss.membershipId})
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Due Date was: {formatDate(iss.returnDueDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by member, card ID, or book..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {['all', 'Unpaid', 'Paid', 'Waived'].map((tab) => (
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

      {/* Fines Table */}
      {paginatedFines.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No fine records match your filter"
          description="Everything is clear! No penalty records found for this query."
          actionLabel="View All Fines"
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
                  <th className="py-3 px-4">Fine ID</th>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Overdue Book</th>
                  <th className="py-3 px-4">Days Overdue</th>
                  <th className="py-3 px-4">Fine Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedFines.map((fine) => {
                  const isUnpaid = fine.status === 'Unpaid';
                  const isPaid = fine.status === 'Paid';
                  const isWaived = fine.status === 'Waived';

                  return (
                    <tr key={fine.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        #{fine.id.slice(0, 10)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{fine.memberName}</p>
                        <p className="text-[11px] font-mono text-slate-400">{fine.membershipId}</p>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-700">
                        {fine.bookTitle}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {fine.daysOverdue} days
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <span className={isUnpaid ? 'text-rose-600' : 'text-slate-800'}>
                          {formatCurrency(fine.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={isPaid ? 'success' : isWaived ? 'default' : 'danger'}
                        >
                          {fine.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {fine.paymentMethod || (isWaived ? 'Waived' : 'Pending')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isUnpaid ? (
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => setSelectedFineForPayment(fine)}
                          >
                            Collect Payment
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {fine.paidAt ? `Paid ${formatDate(fine.paidAt)}` : 'Closed'}
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
      {filteredFines.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredFines.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      )}

      {/* Pay Fine Modal */}
      <PayFineModal
        isOpen={!!selectedFineForPayment}
        onClose={() => setSelectedFineForPayment(null)}
        fine={selectedFineForPayment}
      />
    </div>
  );
};

export default FineManagement;
