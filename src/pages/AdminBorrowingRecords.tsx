import React, { useEffect, useState } from 'react';
import { Book, BorrowRecord, User } from '../types';
import {
  getLocalBooks,
  getLocalRecords,
  getLocalUsers,
  computeDaysDifference,
} from '../utils/storage';
import {
  Search,
  ListFilter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User as UserIcon,
  BookOpen,
} from 'lucide-react';

export const AdminBorrowingRecords: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);

  // Search & Filtering inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'overdue' | 'returned'>('all');

  useEffect(() => {
    setBooks(getLocalBooks());
    setUsers(getLocalUsers());
    setRecords(getLocalRecords());
  }, []);

  // Compute joined items log
  const mappedRecords = records.map((record) => {
    const student = users.find((u) => u.id === record.userId);
    const bookObj = books.find((b) => b.id === record.bookId);

    const { days, isOverdue } = computeDaysDifference(record.dueDate, record.returnedDate);
    const computedStatus = record.status === 'returned' ? 'returned' : isOverdue ? 'overdue' : 'active';

    return {
      ...record,
      studentName: student?.name || 'Unknown Student',
      studentEmail: student?.email || 'Unknown Email',
      bookTitle: bookObj?.title || 'Unknown Book Title',
      bookCover: bookObj?.imageUrl || '',
      daysDiff: days,
      realStatus: computedStatus,
    };
  });

  // Apply filters & search keywords
  const filteredRecords = mappedRecords.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rec.realStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate high level logs count
  const activeCount = mappedRecords.filter((r) => r.realStatus === 'active').length;
  const overdueCount = mappedRecords.filter((r) => r.realStatus === 'overdue').length;
  const returnedCount = mappedRecords.filter((r) => r.realStatus === 'returned').length;

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 text-left" id="admin-records-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1 text-xs font-bold w-fit mb-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Auditing Ledger
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Borrowing Audit Records</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Real-time audit index of all student checkout logs, returned items, and overdue durations.
            </p>
          </div>

          {/* Quick Metrics in Header */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs font-semibold text-gray-500 bg-slate-50 p-3 rounded-xl border">
            <div>
              <span className="block text-gray-700 font-extrabold text-sm">{records.length}</span>
              <span>Total Loans</span>
            </div>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <span className="block text-blue-600 font-extrabold text-sm">{activeCount}</span>
              <span>Ongoing</span>
            </div>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <span className="block text-rose-600 font-extrabold text-sm">{overdueCount}</span>
              <span>Overdue</span>
            </div>
          </div>
        </div>

        {/* Filters control toolbar panel */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Keyword search input */}
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="records-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              placeholder="Search student, email, or book title..."
            />
          </div>

          {/* Quick status pill buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto shrink-0 justify-end">
            <ListFilter className="h-4 w-4 text-gray-400 shrink-0 hidden sm:inline" />
            <div className="inline-flex rounded-xl p-0.5 bg-gray-100 border border-gray-200">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-gray-800 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'active' ? 'bg-blue-500 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Ongoing ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('overdue')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'overdue' ? 'bg-rose-500 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Overdue ({overdueCount})
              </button>
              <button
                onClick={() => setStatusFilter('returned')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'returned' ? 'bg-emerald-500 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Returned ({returnedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Ledger logs grid list */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-150 shadow-3xs">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No loan records coordinate with guidelines.</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              We couldn't find matches under filter constraints. Logged checkouts will populate here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-150 rounded-2xl shadow-3xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">Student details</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Book title</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Borrow / Due Times</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action status</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pr-6">Deadline Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredRecords.map((rec) => {
                    return (
                      <tr key={rec.id} className="hover:bg-gray-50/20 transition-colors">
                        
                        {/* Student details */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-gray-50 border rounded-lg text-gray-400 shrink-0">
                              <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="max-w-[180px]">
                              <p className="font-bold text-gray-900 text-sm truncate" title={rec.studentName}>
                                {rec.studentName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono select-all truncate" title={rec.studentEmail}>
                                {rec.studentEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Book Title */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 max-w-[180px]">
                            <div className="w-7 h-10 bg-gray-100 rounded-md overflow-hidden border shrink-0">
                              <img
                                src={rec.bookCover}
                                alt={rec.bookTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&auto=format&fit=crop&q=60';
                                }}
                              />
                            </div>
                            <p className="font-bold text-gray-900 text-xs truncate" title={rec.bookTitle}>
                              {rec.bookTitle}
                            </p>
                          </div>
                        </td>

                        {/* Borrow / Due dates */}
                        <td className="p-4">
                          <div className="text-xs text-gray-600 font-medium">
                            <p>Borrow: {new Date(rec.borrowDate).toLocaleDateString()}</p>
                            <p className="text-gray-400 text-[10px]">Due: {new Date(rec.dueDate).toLocaleDateString()}</p>
                          </div>
                        </td>

                        {/* Action status index badge */}
                        <td className="p-4">
                          {rec.realStatus === 'returned' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                              Returned
                            </span>
                          )}
                          {rec.realStatus === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-100">
                              <Clock className="w-2.5 h-2.5 text-blue-500" />
                              Active
                            </span>
                          )}
                          {rec.realStatus === 'overdue' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-100">
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                              Overdue
                            </span>
                          )}
                        </td>

                        {/* Deadline details indicator */}
                        <td className="p-4 pr-6 text-xs font-semibold text-gray-600">
                          {rec.realStatus === 'returned' ? (
                            <div className="text-[10px]">
                              <p className="text-emerald-700">Returned on schedule</p>
                              {rec.returnedDate && (
                                <span className="text-gray-400 font-medium">
                                  {new Date(rec.returnedDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : rec.realStatus === 'overdue' ? (
                            <span className="text-rose-600 font-bold block">
                              Overdue by {rec.daysDiff} {rec.daysDiff === 1 ? 'day' : 'days'}
                            </span>
                          ) : (
                            <span className="text-blue-600 font-bold block">
                              {rec.daysDiff} {rec.daysDiff === 1 ? 'day' : 'days'} remaining
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

      </div>
    </div>
  );
};
export default AdminBorrowingRecords;
