import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  Repeat,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import BookCover from '../../components/common/BookCover';
import BookFormModal from './BookFormModal';
import { truncateText } from '../../utils/formatters';
import { toast } from 'react-toastify';

const BookList = () => {
  const navigate = useNavigate();
  const { books, categories, loadingBooks, errorBooks, fetchBooks, deleteBook } = useLibrary();
  const { openAddBookModal } = useOutletContext() || {};

  // View mode
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filtering, Searching, Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, outOfStock
  const [sortBy, setSortBy] = useState('title_asc'); // title_asc, title_desc, year_desc, available_desc

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique authors
  const uniqueAuthors = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      if (b.author) set.add(b.author);
    });
    return Array.from(set).sort();
  }, [books]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search filter (title, author, ISBN)
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          !term ||
          book.title?.toLowerCase().includes(term) ||
          book.author?.toLowerCase().includes(term) ||
          book.isbn?.toLowerCase().includes(term);

        // Category filter
        const matchesCategory =
          !selectedCategory || book.category === selectedCategory;

        // Author filter
        const matchesAuthor = !selectedAuthor || book.author === selectedAuthor;

        // Availability filter
        let matchesAvailability = true;
        if (availabilityFilter === 'available') {
          matchesAvailability = Number(book.availableCopies) > 0;
        } else if (availabilityFilter === 'outOfStock') {
          matchesAvailability = Number(book.availableCopies) <= 0;
        }

        return matchesSearch && matchesCategory && matchesAuthor && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title_desc') return b.title.localeCompare(a.title);
        if (sortBy === 'year_desc') return (b.publishedYear || 0) - (a.publishedYear || 0);
        if (sortBy === 'available_desc') return (b.availableCopies || 0) - (a.availableCopies || 0);
        return 0;
      });
  }, [books, searchTerm, selectedCategory, selectedAuthor, availabilityFilter, sortBy]);

  // Paginated slice
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const handleEdit = (book, e) => {
    e.stopPropagation();
    setBookToEdit(book);
    setIsAddEditModalOpen(true);
  };

  const handleDeletePrompt = (book, e) => {
    e.stopPropagation();
    setBookToDelete(book);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      setIsDeleting(true);
      await deleteBook(bookToDelete.id);
      toast.success(`Book "${bookToDelete.title}" deleted.`);
      setBookToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete book.');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedAuthor('');
    setAvailabilityFilter('all');
    setSortBy('title_asc');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Book Catalog</h1>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              {books.length} Books
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore our curated collection of books, monographs, and literary classics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchBooks()}
            isLoading={loadingBooks}
            title="Sync Catalog"
          >
            Sync Catalog
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setBookToEdit(null);
              setIsAddEditModalOpen(true);
            }}
          >
            Catalog New Book
          </Button>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {errorBooks && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-sm text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorBooks}</span>
          </div>
          <Button variant="danger" size="xs" onClick={() => fetchBooks()}>
            Reload Catalog
          </Button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Author Filter */}
          <select
            value={selectedAuthor}
            onChange={(e) => {
              setSelectedAuthor(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="">All Authors</option>
            {uniqueAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          {/* Sort By Title, Year, Copies */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="title_asc">Sort: Title (A - Z)</option>
            <option value="title_desc">Sort: Title (Z - A)</option>
            <option value="year_desc">Sort: Published Year (Newest)</option>
            <option value="available_desc">Sort: Copies Available (High - Low)</option>
          </select>
        </div>

        {/* View mode toggle & quick pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Availability:</span>
            {['all', 'available', 'outOfStock'].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => {
                  setAvailabilityFilter(filterKey);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  availabilityFilter === filterKey
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filterKey === 'all'
                  ? 'All Books'
                  : filterKey === 'available'
                  ? 'In Stock'
                  : 'Out of Stock'}
              </button>
            ))}

            {(searchTerm || selectedCategory || selectedAuthor || availabilityFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold ml-2 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Grid vs Table View */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Book Content */}
      {loadingBooks ? (
        <SkeletonLoader type={viewMode === 'grid' ? 'card' : 'table'} count={8} />
      ) : paginatedBooks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No books found"
          description="We couldn't find any books matching your search filters. Try clearing your filters or add a new book to the catalog."
          actionLabel="Clear Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginatedBooks.map((book) => {
            const isOutOfStock = Number(book.availableCopies) <= 0;
            return (
              <div
                key={book.id}
                onClick={() => navigate(`/books/${book.id}`)}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Book Jacket Cover */}
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <BookCover
                    src={book.coverImage}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    className="w-full h-full"
                  />
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <Badge variant={isOutOfStock ? 'danger' : 'success'}>
                      {isOutOfStock ? 'Out of Stock' : `${book.availableCopies} Available`}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 z-20">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/85 text-white backdrop-blur-xs">
                      {book.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{book.author}</p>
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                      {book.description || 'No description available.'}
                    </p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-800">{book.publishedYear}</span> •{' '}
                      <span>{book.publisher}</span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleEdit(book, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Edit Book"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePrompt(book, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Book</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4 hidden md:table-cell">ISBN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Year</th>
                  <th className="py-3 px-4 text-center">Copies</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBooks.map((book) => {
                  const isOutOfStock = Number(book.availableCopies) <= 0;
                  return (
                    <tr
                      key={book.id}
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <BookCover
                            src={book.coverImage}
                            title={book.title}
                            author={book.author}
                            category={book.category}
                            className="w-10 h-14 shrink-0 shadow-xs"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-slate-900 truncate">{book.title}</p>
                            <p className="text-xs text-slate-500 truncate">{book.publisher}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{book.author}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-xs hidden md:table-cell">
                        {book.isbn}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{book.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">
                        {book.publishedYear}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-semibold text-xs ${
                            isOutOfStock ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {book.availableCopies} / {book.totalCopies}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/books/${book.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleEdit(book, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeletePrompt(book, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
      {!loadingBooks && filteredBooks.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredBooks.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
          pageSizeOptions={[4, 8, 12, 24]}
        />
      )}

      {/* Add / Edit Book Modal */}
      <BookFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setBookToEdit(null);
        }}
        bookToEdit={bookToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Book from Catalog?"
        message={`Are you sure you want to permanently delete "${bookToDelete?.title}"? This action cannot be reversed.`}
        confirmText="Delete Book"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BookList;
