import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Book,
  BorrowRecord,
} from '../types';
import {
  getLocalBooks,
  saveLocalBooks,
  getLocalRecords,
  saveLocalRecords,
  computeDaysDifference,
} from '../utils/storage';
import { BookOpen, Calendar, RefreshCw, AlertTriangle, UserCheck, Inbox } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import BorrowTable from '../components/BorrowTable';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [userRecords, setUserRecords] = useState<BorrowRecord[]>([]);
  const [activeRecords, setActiveRecords] = useState<BorrowRecord[]>([]);

  const loadDashboardData = () => {
    if (!user) return;
    const allBooks = getLocalBooks();
    const allRecords = getLocalRecords();

    // Filter current user's records
    const filteredRecords = allRecords.filter((r) => r.userId === user.id);
    const activeOnly = filteredRecords.filter((r) => r.status === 'active' || r.status === 'overdue');

    setBooks(allBooks);
    setUserRecords(filteredRecords);
    setActiveRecords(activeOnly);
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleReturnBook = (recordId: string) => {
    const allBooks = getLocalBooks();
    const allRecords = getLocalRecords();

    // Find the original record
    const recordIndex = allRecords.findIndex((r) => r.id === recordId);
    if (recordIndex === -1) {
      showToast('Borrow record not found.', 'error');
      return;
    }

    const record = allRecords[recordIndex];
    if (record.status === 'returned') {
      showToast('Book has already been returned.', 'info');
      return;
    }

    // Find matching book
    const bookIndex = allBooks.findIndex((b) => b.id === record.bookId);
    if (bookIndex !== -1) {
      // Increase available count
      const updatedBook = allBooks[bookIndex];
      // Safety guard to make sure we don't exceed total
      if (updatedBook.availableCopies < updatedBook.totalCopies) {
        updatedBook.availableCopies += 1;
      }
      allBooks[bookIndex] = updatedBook;
      saveLocalBooks(allBooks);
    }

    // Update record state
    allRecords[recordIndex] = {
      ...record,
      status: 'returned',
      returnedDate: new Date().toISOString(),
    };

    saveLocalRecords(allRecords);
    showToast('Book returned successfully! Inventory has been updated.', 'success');

    // Trigger local state refreshes
    loadDashboardData();
  };

  // Compute calculated metrics
  const totalBorrowedCount = userRecords.length;
  const currentlyBorrowedCount = activeRecords.length;
  
  // Calculate overdues count
  const overdueCount = activeRecords.filter((r) => {
    const { isOverdue } = computeDaysDifference(r.dueDate, null);
    return isOverdue;
  }).length;

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 text-left" id="user-dashboard-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs">
          <div>
            <div className="flex items-center gap-2 text-blue-800 bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1 text-xs font-bold w-fit mb-2">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              Student Profile Active
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Welcome back, <span className="text-blue-600">{user?.name}</span>!
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-1">
              Manage your current loans, check deadlines, and browse book allocations.
            </p>
          </div>
          <div className="text-xs text-gray-400 font-bold border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
            <p>MEMBER ID: <span className="text-gray-700 font-mono select-all uppercase">{user?.id}</span></p>
            <p className="mt-1">JOINED: <span className="text-gray-700">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span></p>
          </div>
        </div>

        {/* Totals Metric cards spacer */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Borrowed"
            value={totalBorrowedCount}
            icon={BookOpen}
            colorScheme="indigo"
            subtext="Lifetime borrowings logged"
          />
          <DashboardCard
            title="Active Checkouts"
            value={currentlyBorrowedCount}
            icon={Inbox}
            colorScheme="blue"
            subtext="Books in your possession"
          />
          <DashboardCard
            title="Overdue Books"
            value={overdueCount}
            icon={AlertTriangle}
            colorScheme="rose"
            subtext={overdueCount > 0 ? "Requires urgent returns" : "No overdue items"}
          />
        </div>

        {/* Active loans list panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-blue-600" />
              Currently Borrowed Books
            </h2>
            {currentlyBorrowedCount > 0 && (
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                {currentlyBorrowedCount} Active {currentlyBorrowedCount === 1 ? 'Book' : 'Books'}
              </span>
            )}
          </div>

          <BorrowTable
            records={activeRecords}
            books={books}
            onReturnBook={handleReturnBook}
          />
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
