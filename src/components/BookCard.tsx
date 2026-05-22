import React from 'react';
import { Book } from '../types';
import { BookOpen, User, Tag, Layers, CheckCircle, AlertTriangle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  isBorrowedByCurrentUser?: boolean;
  isLoggedIn: boolean;
  userRole?: 'user' | 'admin';
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onBorrow,
  isBorrowedByCurrentUser = false,
  isLoggedIn,
  userRole,
}) => {
  const isAvailable = book.availableCopies > 0;

  // Render correct action button state
  const renderAction = () => {
    if (userRole === 'admin') {
      return (
        <span className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl ring-1 ring-gray-200">
          Admin View Only
        </span>
      );
    }

    if (!isLoggedIn) {
      return (
        <span className="w-full text-center inline-block px-4 py-2.5 bg-gray-50 text-gray-400 text-xs font-medium rounded-xl border border-gray-100">
          Sign In to Borrow
        </span>
      );
    }

    if (isBorrowedByCurrentUser) {
      return (
        <button
          disabled
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 cursor-not-allowed"
        >
          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
          Active Borrow
        </button>
      );
    }

    if (!isAvailable) {
      return (
        <button
          disabled
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-400 text-xs font-semibold rounded-xl border border-gray-100 cursor-not-allowed"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />
          Out of Stock
        </button>
      );
    }

    return (
      <button
        onClick={() => onBorrow && onBorrow(book.id)}
        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-100 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <BookOpen className="w-3.5 h-3.5" />
        Borrow Book
      </button>
    );
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col h-full"
      id={`book-card-${book.id}`}
    >
      {/* Book Cover Container */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden group">
        <img
          src={book.imageUrl}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Safe fallback image for broken list URLs
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';
          }}
        />
        {/* Category Tag overlay */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
            <Tag className="w-2.5 h-2.5 text-blue-600" />
            {book.category}
          </span>
        </div>

        {/* Available Copies Indicator */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-xs ${
              isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
            }`}
          >
            {isAvailable ? `${book.availableCopies} Left` : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="font-medium truncate">{book.author}</span>
          </div>

          <h3 className="text-base font-bold text-gray-900 line-clamp-1 leading-normal mb-1.5" title={book.title}>
            {book.title}
          </h3>

          <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed mb-4">
            {book.description || 'No description provided.'}
          </p>
        </div>

        {/* Footer info & Button */}
        <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span>Total Stock: {book.totalCopies}</span>
            </div>
            <div>
              <span>Available: {book.availableCopies}</span>
            </div>
          </div>
          {renderAction()}
        </div>
      </div>
    </div>
  );
};
export default BookCard;
