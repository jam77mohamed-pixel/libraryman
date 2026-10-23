import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  Building2,
  Tag,
  Hash,
  CheckCircle2,
  AlertTriangle,
  Repeat,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import ConfirmModal from '../../components/common/ConfirmModal';
import BookCover from '../../components/common/BookCover';
import BookFormModal from './BookFormModal';
import IssueBookModal from '../circulation/IssueBookModal';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, issues, deleteBook } = useLibrary();

  const book = getBookById(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!book) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Book Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">
          The requested book ID does not exist in the catalog or has been deleted.
        </p>
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={() => navigate('/books')}>
            Back to Book Catalog
          </Button>
        </div>
      </div>
    );
  }

  // Active borrowers of this specific book
  const activeLoans = issues.filter(
    (iss) => iss.bookId === book.id && (iss.status === 'Active' || iss.status === 'Overdue')
  );

  const pastLoans = issues.filter(
    (iss) => iss.bookId === book.id && iss.status === 'Returned'
  );

  const isOutOfStock = Number(book.availableCopies) <= 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBook(book.id);
      toast.success('Book deleted successfully.');
      navigate('/books');
    } catch (err) {
      toast.error(err.message || 'Cannot delete book.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and page action bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/books')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Books Catalog
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Edit}
            onClick={() => setIsEditOpen(true)}
          >
            Edit Book
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Repeat}
            disabled={isOutOfStock}
            onClick={() => setIsIssueOpen(true)}
          >
            Issue to Member
          </Button>
        </div>
      </div>

      {/* Main Book Detail Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
            <div className="w-48 sm:w-56 md:w-full h-80 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative">
              <BookCover
                src={book.coverImage}
                title={book.title}
                author={book.author}
                category={book.category}
                className="w-full h-full"
                size="lg"
              />
              <div className="absolute top-3 right-3 z-20">
                <Badge variant={isOutOfStock ? 'danger' : 'success'}>
                  {isOutOfStock ? 'Out of Stock' : `${book.availableCopies} Available`}
                </Badge>
              </div>
            </div>

            <div className="mt-4 w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] text-slate-400 block font-mono">ISBN-13</span>
              <span className="text-xs font-mono font-bold text-slate-800">{book.isbn}</span>
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="indigo">{book.category}</Badge>
                <span className="text-xs text-slate-400">Published in {book.publishedYear}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {book.title}
              </h1>
              <p className="text-base text-indigo-600 font-semibold mt-1">By {book.author}</p>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Synopsis / Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {book.description || 'No detailed synopsis provided for this cataloged entry.'}
              </p>
            </div>

            {/* Spec Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block">Publisher</span>
                <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                  {book.publisher}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block">Published Year</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">
                  {book.publishedYear}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block">Total Copies</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">
                  {book.totalCopies} copies
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block">Available Now</span>
                <span
                  className={`text-xs font-bold block mt-0.5 ${
                    isOutOfStock ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {book.availableCopies} available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Circulation History for this Book */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Borrowers */}
        <Card
          title="Current Borrowers"
          subtitle={`${activeLoans.length} active or overdue checkouts for this book`}
        >
          {activeLoans.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No active borrowings. All available copies are accounted for on bookshelves.
            </p>
          ) : (
            <div className="space-y-3">
              {activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{loan.memberName}</p>
                    <p className="text-slate-500">ID: {loan.membershipId}</p>
                    <p className="text-slate-400 mt-1">
                      Issued: {formatDate(loan.issueDate)} • Due: {formatDate(loan.returnDueDate)}
                    </p>
                  </div>
                  <Badge variant={loan.status === 'Overdue' ? 'danger' : 'warning'}>
                    {loan.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Past Loan History */}
        <Card
          title="Return History"
          subtitle={`${pastLoans.length} previous return transactions recorded`}
        >
          {pastLoans.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No historical returns on record yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {pastLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{loan.memberName}</span>
                    <p className="text-slate-400">
                      Returned on: {formatDate(loan.returnDate || loan.returnDueDate)}
                    </p>
                  </div>
                  <Badge variant="success">Returned</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Edit Modal */}
      <BookFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        bookToEdit={book}
      />

      {/* Issue Modal with this book preselected */}
      <IssueBookModal
        isOpen={isIssueOpen}
        onClose={() => setIsIssueOpen(false)}
        preselectedBookId={book.id}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Book?"
        message={`Are you sure you want to permanently delete "${book.title}" from the catalog?`}
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BookDetails;
