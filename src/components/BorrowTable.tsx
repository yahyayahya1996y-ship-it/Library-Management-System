import React from 'react';
import { BorrowRecord, Book } from '../types';
import { computeDaysDifference } from '../utils/storage';
import { Calendar, RefreshCw, AlertCircle, CheckCircle, Info, BookOpen } from 'lucide-react';

interface BorrowTableProps {
  records: BorrowRecord[];
  books: Book[];
  onReturnBook: (recordId: string) => void;
  isLoading?: boolean;
}

export const BorrowTable: React.FC<BorrowTableProps> = ({
  records,
  books,
  onReturnBook,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium text-sm">No borrowed book records found.</p>
        <p className="text-gray-400 text-xs mt-1">Browse our collection to borrow your first book!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-150 shadow-xs" id="borrow-table-wrapper">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">Book Details</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Borrowed</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status / Period</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => {
              const book = books.find((b) => b.id === record.bookId);
              const isReturned = record.status === 'returned';
              
              // Compute date metrics
              const { days, isOverdue } = computeDaysDifference(record.dueDate, record.returnedDate);
              const status = isReturned ? 'returned' : isOverdue ? 'overdue' : 'active';

              const formattedBorrowDate = new Date(record.borrowDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              
              const formattedDueDate = new Date(record.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Book Info Column */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 shadow-xs border border-gray-100">
                        <img
                          src={book?.imageUrl}
                          alt={book?.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>
                      <div className="max-w-[180px]">
                        <p className="font-bold text-gray-900 text-sm truncate" title={book?.title}>
                          {book?.title || 'Unknown Book'}
                        </p>
                        <p className="text-gray-400 text-xs truncate" title={book?.author}>
                          by {book?.author || 'Unknown Author'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Borrow Date */}
                  <td className="p-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formattedBorrowDate}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="p-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formattedDueDate}
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="p-4">
                    {status === 'returned' ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100 w-fit">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          Returned
                        </span>
                        {record.returnedDate && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            on {new Date(record.returnedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : status === 'overdue' ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-100 w-fit">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          Overdue
                        </span>
                        <span className="text-[10px] text-rose-600 font-semibold">
                          Overdue by {days} {days === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-100 w-fit">
                          <Info className="w-3 h-3 text-blue-500" />
                          Active
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold">
                          {days} {days === 1 ? 'day' : 'days'} left
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Action Handler Button */}
                  <td className="p-4 pr-6 text-right">
                    {status !== 'returned' ? (
                      <button
                        onClick={() => onReturnBook(record.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-200 shadow-3xs cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Return Book
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view card-list type layout */}
      <div className="block md:hidden divide-y divide-gray-100">
        {records.map((record) => {
          const book = books.find((b) => b.id === record.bookId);
          const isReturned = record.status === 'returned';
          const { days, isOverdue } = computeDaysDifference(record.dueDate, record.returnedDate);
          const status = isReturned ? 'returned' : isOverdue ? 'overdue' : 'active';

          return (
            <div key={record.id} className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-16 bg-gray-50 border rounded-md overflow-hidden shrink-0 shadow-3xs">
                  <img
                    src={book?.imageUrl}
                    alt={book?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">{book?.title || 'Unknown Book'}</h4>
                  <p className="text-gray-400 text-xs font-medium">by {book?.author || 'Unknown Author'}</p>
                  <span className="text-xs text-xs font-semibold text-gray-500 uppercase mt-1 tracking-wide block">
                    Category: {book?.category || 'General'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-xl text-xs border border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Borrowed:</span>
                  <span className="font-semibold text-gray-700">
                    {new Date(record.borrowDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Due Date:</span>
                  <span className="font-semibold text-gray-700">
                    {new Date(record.dueDate).toLocaleDateString()}
                  </span>
                </div>
                {record.returnedDate && (
                  <div className="col-span-2 border-t border-gray-100 pt-2">
                    <span className="text-gray-400 font-medium mr-1.5">Returned:</span>
                    <span className="font-semibold text-emerald-700">
                      {new Date(record.returnedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div>
                  {status === 'returned' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      Returned
                    </span>
                  ) : status === 'overdue' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-100">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      Overdue by {days} days
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-100">
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      {days} days left
                    </span>
                  )}
                </div>

                {status !== 'returned' && (
                  <button
                    onClick={() => onReturnBook(record.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all"
                  >
                    <RefreshCw className="w-3 h-3" /> Return Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BorrowTable;
