import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BookCover from '../../components/common/BookCover';
import { useLibrary } from '../../context/LibraryContext';
import { toast } from 'react-toastify';
import { AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';

const IssueBookModal = ({ isOpen, onClose, preselectedBookId = null, preselectedMemberId = null }) => {
  const { books, members, issues, issueBook } = useLibrary();

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [returnDueDate, setReturnDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  // Set default dates on open
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setIssueDate(today);

      const due = new Date();
      due.setDate(due.getDate() + 14); // default 14-day loan
      setReturnDueDate(due.toISOString().split('T')[0]);

      setSelectedBookId(preselectedBookId || '');
      setSelectedMemberId(preselectedMemberId || '');
      setErrorNotice('');
    }
  }, [isOpen, preselectedBookId, preselectedMemberId]);

  // Quick preset helper
  const handlePresetDays = (days) => {
    const base = issueDate ? new Date(issueDate) : new Date();
    base.setDate(base.getDate() + days);
    setReturnDueDate(base.toISOString().split('T')[0]);
  };

  const selectedMember = members.find((m) => m.id === selectedMemberId);
  const selectedBook = books.find((b) => b.id === selectedBookId);

  // Check if member already has this book
  const alreadyHasBook =
    selectedMemberId &&
    selectedBookId &&
    issues.some(
      (iss) =>
        iss.memberId === selectedMemberId &&
        iss.bookId === selectedBookId &&
        (iss.status === 'Active' || iss.status === 'Overdue')
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorNotice('');

    if (!selectedMemberId) {
      setErrorNotice('Please select a borrower member.');
      return;
    }
    if (!selectedBookId) {
      setErrorNotice('Please select a book to issue.');
      return;
    }
    if (!returnDueDate) {
      setErrorNotice('Please set a return due date.');
      return;
    }
    if (new Date(returnDueDate) <= new Date(issueDate)) {
      setErrorNotice('Return due date must be after the issue date.');
      return;
    }

    try {
      setIsSubmitting(true);
      await issueBook({
        memberId: selectedMemberId,
        bookId: selectedBookId,
        issueDate,
        returnDueDate,
      });
      toast.success(
        `Successfully issued "${selectedBook?.title}" to ${selectedMember?.fullName}!`
      );
      onClose();
    } catch (err) {
      setErrorNotice(err.message || 'Failed to issue book.');
      toast.error(err.message || 'Failed to issue book.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Book to Member"
      subtitle="Register a new book borrowing transaction"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorNotice && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Member Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Member <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">-- Choose registered member --</option>
            {members.map((m) => (
              <option key={m.id} value={m.id} disabled={m.status === 'Suspended'}>
                {m.fullName} ({m.membershipId}) {m.status === 'Suspended' ? ' - [SUSPENDED]' : ''}
              </option>
            ))}
          </select>
          {selectedMember && (
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
              <span>Card: {selectedMember.membershipId}</span>
              <span
                className={`font-medium ${
                  selectedMember.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                Status: {selectedMember.status}
              </span>
            </div>
          )}
        </div>

        {/* Book Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Book to Issue <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">-- Choose book from catalog --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                {b.title} — {b.availableCopies} of {b.totalCopies} copies available
                {b.availableCopies <= 0 ? ' [OUT OF STOCK]' : ''}
              </option>
            ))}
          </select>

          {selectedBook && (
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
              <BookCover
                src={selectedBook.coverImage}
                title={selectedBook.title}
                author={selectedBook.author}
                category={selectedBook.category}
                className="w-10 h-14 shrink-0 shadow-xs"
              />
              <div className="min-w-0 text-xs">
                <p className="font-semibold text-slate-900 truncate">{selectedBook.title}</p>
                <p className="text-slate-500">By {selectedBook.author}</p>
                <p className="text-slate-500">ISBN: {selectedBook.isbn}</p>
                <span
                  className={`inline-block mt-1 font-semibold ${
                    selectedBook.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {selectedBook.availableCopies} available copies in library
                </span>
              </div>
            </div>
          )}
        </div>

        {alreadyHasBook && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>Duplicate Loan Warning:</strong> This member already has an active borrowing of this book. Duplicate issues are blocked by library policy.
            </span>
          </div>
        )}

        {/* Issue Date & Return Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Issue Date"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">
                Return Due Date <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handlePresetDays(7)}
                  className="text-[11px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-pointer font-medium"
                >
                  +7d
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDays(14)}
                  className="text-[11px] px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 rounded text-indigo-600 cursor-pointer font-medium"
                >
                  +14d
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDays(30)}
                  className="text-[11px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-pointer font-medium"
                >
                  +30d
                </button>
              </div>
            </div>
            <Input
              type="date"
              value={returnDueDate}
              onChange={(e) => setReturnDueDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={alreadyHasBook || (selectedBook && selectedBook.availableCopies <= 0)}
          >
            Confirm Issue
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default IssueBookModal;
