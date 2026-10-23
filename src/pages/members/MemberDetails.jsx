import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Repeat,
  DollarSign,
  Edit,
  Trash2,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import ConfirmModal from '../../components/common/ConfirmModal';
import MemberFormModal from './MemberFormModal';
import IssueBookModal from '../circulation/IssueBookModal';
import PayFineModal from '../fines/PayFineModal';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMemberById, issues, fines, returnBook, deleteMember } = useLibrary();

  const member = getMemberById(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFineToPay, setSelectedFineToPay] = useState(null);

  if (!member) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Member Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">
          The requested member record does not exist or has been removed.
        </p>
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={() => navigate('/members')}>
            Back to Member Directory
          </Button>
        </div>
      </div>
    );
  }

  // Member's issues
  const memberActiveIssues = issues.filter(
    (iss) =>
      iss.memberId === member.id && (iss.status === 'Active' || iss.status === 'Overdue')
  );

  const memberPastIssues = issues.filter(
    (iss) => iss.memberId === member.id && iss.status === 'Returned'
  );

  // Member's fines
  const memberFines = fines.filter((f) => f.memberId === member.id);
  const unpaidFinesTotal = memberFines
    .filter((f) => f.status === 'Unpaid')
    .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const handleReturn = async (issueId) => {
    try {
      const result = await returnBook(issueId);
      if (result.fineRecord) {
        toast.warning(
          `Book returned. An overdue fine of ${formatCurrency(result.fineRecord.amount)} was assessed.`
        );
      } else {
        toast.success('Book successfully returned in good standing!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to process return.');
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMember(member.id);
      toast.success('Member removed successfully.');
      navigate('/members');
    } catch (err) {
      toast.error(err.message || 'Cannot remove member.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/members')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Edit}
            onClick={() => setIsEditOpen(true)}
          >
            Edit Profile
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setIsDeleteOpen(true)}
          >
            Remove
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Repeat}
            disabled={member.status === 'Suspended'}
            onClick={() => setIsIssueOpen(true)}
          >
            Issue Book
          </Button>
        </div>
      </div>

      {/* Member Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={member.avatar}
              alt={member.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-md"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{member.fullName}</h1>
                <Badge variant={member.status === 'Active' ? 'success' : 'danger'}>
                  {member.status}
                </Badge>
              </div>
              <p className="text-xs font-mono font-semibold text-indigo-600 mt-1">
                Card ID: {member.membershipId}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Member since {formatDate(member.membershipDate)}
              </p>
            </div>
          </div>

          {/* Quick Fine Alert pill */}
          {unpaidFinesTotal > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-right">
              <span className="text-xs font-medium text-rose-600 block">Pending Fines</span>
              <span className="text-xl font-bold text-rose-700">
                {formatCurrency(unpaidFinesTotal)}
              </span>
            </div>
          )}
        </div>

        {/* Contact details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Email Address</span>
              <span className="text-xs font-semibold text-slate-800">{member.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Phone Number</span>
              <span className="text-xs font-semibold text-slate-800">{member.mobileNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Address</span>
              <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                {member.address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Active Loans */}
      <Card
        title="Currently Borrowed Books"
        subtitle={`${memberActiveIssues.length} active or overdue loans checked out by this cardholder`}
        action={
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setIsIssueOpen(true)}
            disabled={member.status === 'Suspended'}
          >
            + Issue Another
          </Button>
        }
      >
        {memberActiveIssues.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            This member currently has no borrowed books in hand.
          </p>
        ) : (
          <div className="space-y-3">
            {memberActiveIssues.map((iss) => (
              <div
                key={iss.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{iss.bookTitle}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>Issued: {formatDate(iss.issueDate)}</span>
                    <span>•</span>
                    <span
                      className={`font-semibold ${
                        iss.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-700'
                      }`}
                    >
                      Due: {formatDate(iss.returnDueDate)}
                    </span>
                    {iss.status === 'Overdue' && (
                      <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                        Fine: {formatCurrency(iss.fineAmount)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={iss.status === 'Overdue' ? 'danger' : 'warning'}>
                    {iss.status}
                  </Badge>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleReturn(iss.id)}
                  >
                    Process Return
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Member Fines Table */}
      <Card
        title="Fine & Penalty Ledger"
        subtitle={`Total unpaid fines: ${formatCurrency(unpaidFinesTotal)}`}
      >
        {memberFines.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            Clean record! No fines or penalties recorded for this member.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Book</th>
                  <th className="py-2.5 px-3">Overdue Days</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberFines.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{f.bookTitle}</td>
                    <td className="py-2.5 px-3 text-slate-600">{f.daysOverdue} days</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      {formatCurrency(f.amount)}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          f.status === 'Paid'
                            ? 'success'
                            : f.status === 'Waived'
                            ? 'default'
                            : 'danger'
                        }
                      >
                        {f.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {f.status === 'Unpaid' && (
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => setSelectedFineToPay(f)}
                        >
                          Collect Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <MemberFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        memberToEdit={member}
      />

      <IssueBookModal
        isOpen={isIssueOpen}
        onClose={() => setIsIssueOpen(false)}
        preselectedMemberId={member.id}
      />

      <PayFineModal
        isOpen={!!selectedFineToPay}
        onClose={() => setSelectedFineToPay(null)}
        fine={selectedFineToPay}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Remove Member?"
        message={`Are you sure you want to remove ${member.fullName}? Cardholders with active borrowings cannot be deleted.`}
        confirmText="Confirm Remove"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MemberDetails;
