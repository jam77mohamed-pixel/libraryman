import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { bookService } from '../services/bookService';
import { memberService } from '../services/memberService';
import {
  INITIAL_CATEGORIES,
  INITIAL_ISSUES,
  INITIAL_FINES,
  INITIAL_ACTIVITIES,
} from '../data/initialData';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { calculateDaysOverdue, calculateFineAmount, DAILY_FINE_RATE } from '../utils/formatters';

const LibraryContext = createContext(null);

const STORAGE_KEYS = {
  CATEGORIES: 'library_categories_v1',
  ISSUES: 'library_issues_v1',
  FINES: 'library_fines_v1',
  ACTIVITIES: 'library_activities_v1',
};

export const LibraryProvider = ({ children }) => {
  // Books state
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [errorBooks, setErrorBooks] = useState(null);

  // Members state
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [errorMembers, setErrorMembers] = useState(null);

  // Categories state
  const [categories, setCategories] = useState(() =>
    getStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );

  // Issues / Loans state
  const [issues, setIssues] = useState(() =>
    getStorageItem(STORAGE_KEYS.ISSUES, INITIAL_ISSUES)
  );

  // Fines state
  const [fines, setFines] = useState(() =>
    getStorageItem(STORAGE_KEYS.FINES, INITIAL_FINES)
  );

  // Activities log
  const [activities, setActivities] = useState(() =>
    getStorageItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );

  // Load books from service (with DummyJSON integration)
  const fetchBooks = useCallback(async () => {
    try {
      setLoadingBooks(true);
      setErrorBooks(null);
      const data = await bookService.getBooks();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books:', err);
      setErrorBooks(err.message || 'Unable to load books from server.');
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  // Load members from service (with DummyJSON integration)
  const fetchMembers = useCallback(async () => {
    try {
      setLoadingMembers(true);
      setErrorMembers(null);
      const data = await memberService.getMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to load members:', err);
      setErrorMembers(err.message || 'Unable to load members.');
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, [fetchBooks, fetchMembers]);

  // Sync state changes to storage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ISSUES, issues);
  }, [issues]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.FINES, fines);
  }, [fines]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  // Log activity helper
  const logActivity = useCallback((type, title, description) => {
    const newAct = {
      id: 'act-' + Date.now(),
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 49)]); // keep latest 50
  }, []);

  // BOOK OPERATIONS
  const addBook = async (bookData) => {
    const newBook = await bookService.addBook(bookData);
    setBooks((prev) => [newBook, ...prev]);
    logActivity('book_add', 'New Book Added', `Added "${newBook.title}" by ${newBook.author}`);
    return newBook;
  };

  const updateBook = async (id, bookData) => {
    const updated = await bookService.updateBook(id, bookData);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    logActivity('book_edit', 'Book Updated', `Updated details for "${updated.title}"`);
    return updated;
  };

  const deleteBook = async (id) => {
    const target = books.find((b) => b.id === id);
    // Check if book currently has active issues
    const hasActiveLoan = issues.some(
      (iss) => iss.bookId === id && (iss.status === 'Active' || iss.status === 'Overdue')
    );
    if (hasActiveLoan) {
      throw new Error('Cannot delete this book because copies are currently issued to members.');
    }

    await bookService.deleteBook(id, target?.apiId);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    logActivity('book_delete', 'Book Removed', `Deleted "${target?.title || 'Book'}" from library`);
    return true;
  };

  const getBookById = (id) => books.find((b) => b.id === id);

  // MEMBER OPERATIONS
  const addMember = async (memberData) => {
    const newMember = await memberService.addMember(memberData);
    setMembers((prev) => [newMember, ...prev]);
    logActivity('member_add', 'Member Registered', `Enrolled ${newMember.fullName} (${newMember.membershipId})`);
    return newMember;
  };

  const updateMember = async (id, memberData) => {
    const updated = await memberService.updateMember(id, memberData);
    setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
    logActivity('member_edit', 'Member Profile Updated', `Updated profile of ${updated.fullName}`);
    return updated;
  };

  const deleteMember = async (id) => {
    const target = members.find((m) => m.id === id);
    const hasActiveLoans = issues.some(
      (iss) => iss.memberId === id && (iss.status === 'Active' || iss.status === 'Overdue')
    );
    if (hasActiveLoans) {
      throw new Error('Cannot delete member with active or overdue borrowed books.');
    }

    await memberService.deleteMember(id, target?.apiId);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    logActivity('member_delete', 'Member Removed', `Removed member ${target?.fullName || id}`);
    return true;
  };

  const getMemberById = (id) => members.find((m) => m.id === id);

  // CATEGORY OPERATIONS
  const addCategory = (categoryData) => {
    const colors = ['indigo', 'purple', 'emerald', 'cyan', 'amber', 'rose', 'sky', 'teal'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newCat = {
      ...categoryData,
      id: 'cat-' + Date.now(),
      color: categoryData.color || randomColor,
    };
    setCategories((prev) => [...prev, newCat]);
    logActivity('category_add', 'Category Created', `Created category "${newCat.name}"`);
    return newCat;
  };

  const updateCategory = (id, catData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...catData } : c))
    );
    logActivity('category_edit', 'Category Updated', `Updated category "${catData.name}"`);
  };

  const deleteCategory = (id) => {
    const cat = categories.find((c) => c.id === id);
    // Check if any books use this category
    const countInCat = books.filter((b) => b.category === cat?.name).length;
    if (countInCat > 0) {
      throw new Error(`Cannot delete category "${cat?.name}". It currently has ${countInCat} books.`);
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    logActivity('category_delete', 'Category Removed', `Deleted category "${cat?.name}"`);
    return true;
  };

  // CIRCULATION / ISSUE & RETURN OPERATIONS
  const issueBook = async ({ memberId, bookId, issueDate, returnDueDate }) => {
    const book = books.find((b) => b.id === bookId);
    const member = members.find((m) => m.id === memberId);

    if (!book) throw new Error('Selected book was not found.');
    if (!member) throw new Error('Selected member was not found.');

    if (member.status === 'Suspended') {
      throw new Error(`Member ${member.fullName} is suspended and cannot borrow books.`);
    }

    if (book.availableCopies <= 0) {
      throw new Error(`No available copies of "${book.title}" in stock.`);
    }

    // Check duplicate issue: Does this member already have an active/overdue loan for this book?
    const alreadyIssued = issues.some(
      (iss) =>
        iss.memberId === memberId &&
        iss.bookId === bookId &&
        (iss.status === 'Active' || iss.status === 'Overdue')
    );

    if (alreadyIssued) {
      throw new Error(`Member ${member.fullName} already has a copy of "${book.title}" currently issued.`);
    }

    const newIssue = {
      id: 'iss-' + Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.fullName,
      membershipId: member.membershipId,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      returnDueDate: returnDueDate,
      returnDate: null,
      status: 'Active',
      fineAmount: 0,
      finePaid: false,
    };

    // Update book available copies (-1)
    const updatedBook = {
      ...book,
      availableCopies: Math.max(0, book.availableCopies - 1),
    };
    await bookService.updateBook(book.id, updatedBook);
    setBooks((prev) => prev.map((b) => (b.id === book.id ? updatedBook : b)));

    // Record issue
    setIssues((prev) => [newIssue, ...prev]);

    logActivity(
      'issue',
      'Book Issued',
      `Issued "${book.title}" to ${member.fullName} (Due: ${returnDueDate})`
    );

    return newIssue;
  };

  const returnBook = async (issueId, returnDate = new Date().toISOString().split('T')[0]) => {
    const issue = issues.find((iss) => iss.id === issueId);
    if (!issue) throw new Error('Issue record not found.');
    if (issue.status === 'Returned') {
      throw new Error('This book has already been marked as returned.');
    }

    const book = books.find((b) => b.id === issue.bookId);

    // Calculate overdue fine if returned late
    const daysOverdue = calculateDaysOverdue(issue.returnDueDate, returnDate);
    const fineAmount = calculateFineAmount(daysOverdue, DAILY_FINE_RATE);

    let fineRecord = null;
    if (fineAmount > 0) {
      fineRecord = {
        id: 'fine-' + Date.now(),
        issueId: issue.id,
        memberId: issue.memberId,
        memberName: issue.memberName,
        membershipId: issue.membershipId,
        bookTitle: issue.bookTitle,
        dueDate: issue.returnDueDate,
        daysOverdue,
        amount: fineAmount,
        status: 'Unpaid',
        createdAt: new Date().toISOString(),
      };
      setFines((prev) => [fineRecord, ...prev]);
    }

    // Update issue record
    const updatedIssue = {
      ...issue,
      returnDate,
      status: 'Returned',
      fineAmount,
      finePaid: fineAmount === 0,
    };

    setIssues((prev) => prev.map((iss) => (iss.id === issueId ? updatedIssue : iss)));

    // Increase book available copies (+1) if book still exists
    if (book) {
      const updatedBook = {
        ...book,
        availableCopies: Math.min(book.totalCopies, book.availableCopies + 1),
      };
      await bookService.updateBook(book.id, updatedBook);
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updatedBook : b)));
    }

    logActivity(
      'return',
      'Book Returned',
      `"${issue.bookTitle}" returned by ${issue.memberName}${fineAmount > 0 ? ` (Overdue Fine: $${fineAmount.toFixed(2)})` : ''}`
    );

    return { updatedIssue, fineRecord };
  };

  // FINE OPERATIONS
  const payFine = (fineId, paymentMethod = 'Cash') => {
    const fine = fines.find((f) => f.id === fineId);
    if (!fine) throw new Error('Fine record not found.');
    if (fine.status === 'Paid') throw new Error('This fine is already marked as paid.');

    const updatedFine = {
      ...fine,
      status: 'Paid',
      paymentMethod,
      paidAt: new Date().toISOString().split('T')[0],
    };

    setFines((prev) => prev.map((f) => (f.id === fineId ? updatedFine : f)));

    // Also update corresponding issue if needed
    if (fine.issueId) {
      setIssues((prev) =>
        prev.map((iss) =>
          iss.id === fine.issueId ? { ...iss, finePaid: true } : iss
        )
      );
    }

    logActivity(
      'fine_paid',
      'Fine Collected',
      `Collected $${fine.amount.toFixed(2)} from ${fine.memberName} (${paymentMethod})`
    );

    return updatedFine;
  };

  const waiveFine = (fineId, reason = 'Administrative waiver') => {
    const fine = fines.find((f) => f.id === fineId);
    if (!fine) throw new Error('Fine record not found.');

    const updatedFine = {
      ...fine,
      status: 'Waived',
      waiveReason: reason,
      waivedAt: new Date().toISOString().split('T')[0],
    };

    setFines((prev) => prev.map((f) => (f.id === fineId ? updatedFine : f)));
    logActivity('fine_waived', 'Fine Waived', `Waived $${fine.amount.toFixed(2)} for ${fine.memberName} - ${reason}`);
    return updatedFine;
  };

  // Automatic overdue status evaluator
  // Periodically check if any 'Active' issues have crossed due date and mark them 'Overdue'
  useEffect(() => {
    let hasChanges = false;
    const nowStr = new Date().toISOString().split('T')[0];

    const updated = issues.map((iss) => {
      if (iss.status === 'Active' && !iss.returnDate) {
        const days = calculateDaysOverdue(iss.returnDueDate, nowStr);
        if (days > 0) {
          hasChanges = true;
          const calculatedFine = calculateFineAmount(days, DAILY_FINE_RATE);
          return {
            ...iss,
            status: 'Overdue',
            fineAmount: calculatedFine,
          };
        }
      }
      return iss;
    });

    if (hasChanges) {
      setIssues(updated);
    }
  }, [issues]);

  // DERIVED METRICS FOR DASHBOARDS & REPORTS
  const stats = useMemo(() => {
    const totalBookTitles = books.length;
    const totalBookCopies = books.reduce((sum, b) => sum + (Number(b.totalCopies) || 0), 0);
    const booksAvailable = books.reduce((sum, b) => sum + (Number(b.availableCopies) || 0), 0);

    const activeIssues = issues.filter((iss) => iss.status === 'Active' || iss.status === 'Overdue');
    const overdueIssues = issues.filter((iss) => iss.status === 'Overdue');
    const returnedIssues = issues.filter((iss) => iss.status === 'Returned');

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'Active').length;

    const totalCategories = categories.length;

    // Fines calculations
    const totalFineCollected = fines
      .filter((f) => f.status === 'Paid')
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    const pendingFines = fines
      .filter((f) => f.status === 'Unpaid')
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    return {
      totalBooks: totalBookTitles,
      totalBookCopies,
      booksIssued: activeIssues.length,
      booksAvailable,
      overdueBooks: overdueIssues.length,
      booksReturned: returnedIssues.length,
      totalMembers,
      activeMembers,
      totalCategories,
      totalFineCollected,
      pendingFines,
    };
  }, [books, members, issues, categories, fines]);

  return (
    <LibraryContext.Provider
      value={{
        // Books
        books,
        loadingBooks,
        errorBooks,
        fetchBooks,
        addBook,
        updateBook,
        deleteBook,
        getBookById,

        // Members
        members,
        loadingMembers,
        errorMembers,
        fetchMembers,
        addMember,
        updateMember,
        deleteMember,
        getMemberById,

        // Categories
        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        // Circulation
        issues,
        issueBook,
        returnBook,

        // Fines
        fines,
        payFine,
        waiveFine,

        // Activities
        activities,
        logActivity,

        // Stats
        stats,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
