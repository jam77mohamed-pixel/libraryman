import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import MemberFormModal from './MemberFormModal';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';

const MemberList = () => {
  const navigate = useNavigate();
  const { members, issues, loadingMembers, errorMembers, fetchMembers, deleteMember } = useLibrary();
  const { openAddMemberModal } = useOutletContext() || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, Active, Suspended

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        m.fullName?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.membershipId?.toLowerCase().includes(term) ||
        m.mobileNumber?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, searchTerm, statusFilter]);

  // Paginated members
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const handleEdit = (member, e) => {
    e.stopPropagation();
    setMemberToEdit(member);
    setIsAddEditModalOpen(true);
  };

  const handleDeletePrompt = (member, e) => {
    e.stopPropagation();
    setMemberToDelete(member);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      setIsDeleting(true);
      await deleteMember(memberToDelete.id);
      toast.success(`Member ${memberToDelete.fullName} removed.`);
      setMemberToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Cannot remove member.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getActiveLoanCount = (memberId) => {
    return issues.filter(
      (iss) =>
        iss.memberId === memberId && (iss.status === 'Active' || iss.status === 'Overdue')
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Member Directory</h1>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
              {members.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage cardholders, borrowing quotas, contact information, and membership status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchMembers()}
            isLoading={loadingMembers}
            title="Refresh Directory"
          >
            Refresh Directory
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => {
              setMemberToEdit(null);
              setIsAddEditModalOpen(true);
            }}
          >
            Enroll New Member
          </Button>
        </div>
      </div>

      {/* Error state */}
      {errorMembers && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-sm text-rose-800">
          <span>{errorMembers}</span>
          <Button variant="danger" size="xs" onClick={() => fetchMembers()}>
            Retry
          </Button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or Membership ID..."
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
          {['all', 'Active', 'Suspended'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid / Cards */}
      {loadingMembers ? (
        <SkeletonLoader type="table" count={6} />
      ) : paginatedMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description="We couldn't find any library cardholders matching your search criteria."
          actionLabel="Clear Filter"
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedMembers.map((member) => {
            const activeLoans = getActiveLoanCount(member.id);
            const isSuspended = member.status === 'Suspended';

            return (
              <div
                key={member.id}
                onClick={() => navigate(`/members/${member.id}`)}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top: Avatar & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {member.fullName}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-500 font-medium">
                          {member.membershipId}
                        </p>
                      </div>
                    </div>
                    <Badge variant={isSuspended ? 'danger' : 'success'}>
                      {member.status}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{member.mobileNumber}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{member.address}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Loan status & actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Active Loans</span>
                    <span
                      className={`font-semibold ${
                        activeLoans > 0 ? 'text-amber-600' : 'text-slate-700'
                      }`}
                    >
                      {activeLoans} {activeLoans === 1 ? 'book' : 'books'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/members/${member.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleEdit(member, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="Edit Member"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePrompt(member, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loadingMembers && filteredMembers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredMembers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
          pageSizeOptions={[4, 8, 12, 24]}
        />
      )}

      {/* Add / Edit Member Modal */}
      <MemberFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Member?"
        message={`Are you sure you want to remove ${memberToDelete?.fullName} (${memberToDelete?.membershipId})? Cardholders with active borrowings cannot be removed.`}
        confirmText="Remove Member"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MemberList;
