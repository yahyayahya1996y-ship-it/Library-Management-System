import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Book, BorrowRecord } from '../types';
import {
  getLocalBooks,
  saveLocalBooks,
  getLocalRecords,
  saveLocalRecords,
  computeDaysDifference,
} from '../utils/storage';
import { Bookmark, Calendar, CheckSquare, ListFilter, RotateCcw } from 'lucide-react';
import BorrowTable from '../components/BorrowTable';

export const MyBorrowedBooks: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [userRecords, setUserRecords] = useState<BorrowRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BorrowRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadBorrowedData = () => {
    if (!user) return;
    const allBooks = getLocalBooks();
    const allRecords = getLocalRecords();

    // Filter user's specific items
    const curUserRecs = allRecords.filter((r) => r.userId === user.id);
    
    // Default sorting: active and overdue first, then returned, newest borrow first
    const sorted = [...curUserRecs].sort((a, b) => {
      if (a.status !== 'returned' && b.status === 'returned') return -1;
      if (a.status === 'returned' && b.status !== 'returned') return 1;
      return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
    });

    setBooks(allBooks);
    setUserRecords(sorted);
    setFilteredRecords(sorted);
    setFilterStatus('all'); // Reset filter
  };

  useEffect(() => {
    loadBorrowedData();
  }, [user]);

  // Handle returns
  const handleReturnBook = (recordId: string) => {
    const allBooks = getLocalBooks();
    const allRecords = getLocalRecords();

    const recordIndex = allRecords.findIndex((r) => r.id === recordId);
    if (recordIndex === -1) {
      showToast('Record not found.', 'error');
      return;
    }

    const record = allRecords[recordIndex];
    if (record.status === 'returned') {
      showToast('This book copy has already been filed as returned.', 'info');
      return;
    }

    // Refill stock
    const bookIndex = allBooks.findIndex((b) => b.id === record.bookId);
    if (bookIndex !== -1) {
      const bookToReturn = allBooks[bookIndex];
      if (bookToReturn.availableCopies < bookToReturn.totalCopies) {
        bookToReturn.availableCopies += 1;
      }
      allBooks[bookIndex] = bookToReturn;
      saveLocalBooks(allBooks);
    }

    // Adjust record
    allRecords[recordIndex] = {
      ...record,
      status: 'returned',
      returnedDate: new Date().toISOString(),
    };

    saveLocalRecords(allRecords);
    showToast('Book returned successfully! Thank you for keeping our stock up to date.', 'success');

    loadBorrowedData();
  };

  // Perform client-side filter logic whenever filter status option changes
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredRecords(userRecords);
    } else if (filterStatus === 'active') {
      const active = userRecords.filter((r) => {
        const { isOverdue } = computeDaysDifference(r.dueDate, r.returnedDate);
        return r.status !== 'returned' && !isOverdue;
      });
      setFilteredRecords(active);
    } else if (filterStatus === 'overdue') {
      const overdue = userRecords.filter((r) => {
        const { isOverdue } = computeDaysDifference(r.dueDate, r.returnedDate);
        return r.status !== 'returned' && isOverdue;
      });
      setFilteredRecords(overdue);
    } else if (filterStatus === 'returned') {
      setFilteredRecords(userRecords.filter((r) => r.status === 'returned'));
    }
  }, [filterStatus, userRecords]);

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 text-left" id="my-borrowed-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1 text-xs font-bold w-fit mb-2">
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              Borrowing Registry
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">My Borrowed Books</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Check active item deadlines, inspect historic logs, or file immediate returns.
            </p>
          </div>

          {/* Filter Option Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <ListFilter className="w-3.5 h-3.5" /> Filter by:
            </span>
            <div className="inline-flex rounded-xl p-0.5 bg-gray-100 border border-gray-200">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white text-gray-800 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All ({userRecords.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'active'
                    ? 'bg-blue-500 text-white shadow-3xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilterStatus('overdue')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'overdue'
                    ? 'bg-rose-500 text-white shadow-3xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Overdue
              </button>
              <button
                onClick={() => setFilterStatus('returned')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'returned'
                    ? 'bg-emerald-500 text-white shadow-3xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Display Wrapper */}
        <div className="space-y-4">
          <BorrowTable
            records={filteredRecords}
            books={books}
            onReturnBook={handleReturnBook}
          />
        </div>
      </div>
    </div>
  );
};
export default MyBorrowedBooks;
