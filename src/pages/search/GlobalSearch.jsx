import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Users,
  Repeat,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import BookCover from '../../components/common/BookCover';
import { formatDate } from '../../utils/formatters';

const GlobalSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { books, members, issues } = useLibrary();

  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'books', 'members', 'issues'

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { q: searchTerm } : {});
  };

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return { books: [], members: [], issues: [] };

    const matchedBooks = books.filter(
      (b) =>
        b.title?.toLowerCase().includes(term) ||
        b.author?.toLowerCase().includes(term) ||
        b.isbn?.toLowerCase().includes(term) ||
        b.category?.toLowerCase().includes(term)
    );

    const matchedMembers = members.filter(
      (m) =>
        m.fullName?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.membershipId?.toLowerCase().includes(term) ||
        m.mobileNumber?.toLowerCase().includes(term)
    );

    const matchedIssues = issues.filter(
      (iss) =>
        iss.bookTitle?.toLowerCase().includes(term) ||
        iss.memberName?.toLowerCase().includes(term) ||
        iss.membershipId?.toLowerCase().includes(term)
    );

    return {
      books: matchedBooks,
      members: matchedMembers,
      issues: matchedIssues,
    };
  }, [searchTerm, books, members, issues]);

  const totalResultsCount =
    results.books.length + results.members.length + results.issues.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Global Library Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Instant multi-entity search across Book Catalog, Member Directory, and Circulation Records
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by book title, author, ISBN (e.g. 978-...), cardholder name, or LIB-XXXX..."
          className="w-full pl-12 pr-28 py-3 text-sm sm:text-base border border-slate-300 rounded-2xl bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
          autoFocus
        />
        <div className="absolute right-2.5 top-2">
          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
        </div>
      </form>

      {/* Tabs */}
      {searchTerm.trim() && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Results ({totalResultsCount})
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'books'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Books ({results.books.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'members'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Members ({results.members.length})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'issues'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Circulation ({results.issues.length})
          </button>
        </div>
      )}

      {/* Content */}
      {!searchTerm.trim() ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            Start typing to explore the repository
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Search by book title, author, ISBN code, cardholder name, or membership ID.
          </p>
        </div>
      ) : totalResultsCount === 0 ? (
        <EmptyState
          icon={Search}
          title={`No results matching "${searchTerm}"`}
          description="Try checking for typos or searching with different keywords."
        />
      ) : (
        <div className="space-y-6">
          {/* Books Section */}
          {(activeTab === 'all' || activeTab === 'books') && results.books.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Books ({results.books.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookCover
                        src={book.coverImage}
                        title={book.title}
                        author={book.author}
                        category={book.category}
                        className="w-12 h-16 shrink-0 shadow-xs"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {book.title}
                        </h4>
                        <p className="text-xs text-slate-500">By {book.author}</p>
                        <p className="text-[11px] font-mono text-slate-400">ISBN: {book.isbn}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {book.availableCopies} available of {book.totalCopies}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Section */}
          {(activeTab === 'all' || activeTab === 'members') && results.members.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Members ({results.members.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => navigate(`/members/${member.id}`)}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {member.fullName}
                        </h4>
                        <p className="text-xs font-mono text-indigo-600">
                          {member.membershipId}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant={member.status === 'Active' ? 'success' : 'danger'}>
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues Section */}
          {(activeTab === 'all' || activeTab === 'issues') && results.issues.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Repeat className="w-4 h-4 text-amber-600" />
                <span>Circulation Loans ({results.issues.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.issues.map((iss) => (
                  <div
                    key={iss.id}
                    onClick={() => navigate('/circulation')}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">
                        {iss.bookTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Borrower: {iss.memberName} ({iss.membershipId})
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Due Date: {formatDate(iss.returnDueDate)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        iss.status === 'Overdue'
                          ? 'danger'
                          : iss.status === 'Returned'
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {iss.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
