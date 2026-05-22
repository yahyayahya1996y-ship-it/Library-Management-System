import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Book, BorrowRecord } from '../types';
import {
  getLocalBooks,
  saveLocalBooks,
  getLocalRecords,
  saveLocalRecords,
  initializeStorage,
} from '../utils/storage';
import { Search, SlidersHorizontal, BookOpen, Layers, Library } from 'lucide-react';
import BookCard from '../components/BookCard';

export const BooksPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);

  const loadData = () => {
    initializeStorage();
    const allBooks = getLocalBooks();
    const allRecords = getLocalRecords();
    
    setBooks(allBooks);
    setRecords(allRecords);

    // Extract categories dynamically
    const uniqueCategories = Array.from(new Set(allBooks.map((b) => b.category)));
    setCategories(['All', ...uniqueCategories]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBorrowBook = (bookId: string) => {
    if (!user) {
      showToast('Please sign up or log in to borrow books.', 'info');
      return;
    }

    if (user.role === 'admin') {
      showToast('Admins cannot borrow library books.', 'error');
      return;
    }

    const allBooks = getLocalBooks();
    const allRecords = getLocalRecords();

    // Find the book
    const bookIndex = allBooks.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) {
      showToast('Selected book could not be found.', 'error');
      return;
    }

    const targetBook = allBooks[bookIndex];

    // Check availability
    if (targetBook.availableCopies <= 0) {
      showToast('This book is currently out of stock.', 'error');
      return;
    }

    // Check if current user already has an active borrow of this book
    const alreadyBorrowed = allRecords.some(
      (r) => r.userId === user.id && r.bookId === bookId && (r.status === 'active' || r.status === 'overdue')
    );

    if (alreadyBorrowed) {
      showToast('You already have an active loan for this book. Complete the return first.', 'error');
      return;
    }

    // Decrement availableCopies
    targetBook.availableCopies -= 1;
    allBooks[bookIndex] = targetBook;

    // Create record
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14); // 14 days periods

    const newRecord: BorrowRecord = {
      id: 'record-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      bookId: bookId,
      borrowDate: today.toISOString(),
      dueDate: dueDate.toISOString(),
      returnedDate: null,
      status: 'active',
    };

    allRecords.push(newRecord);

    // Persist changes
    saveLocalBooks(allBooks);
    saveLocalRecords(allRecords);

    showToast(`Successfully borrowed "${targetBook.title}"! Due date is in 14 days.`, 'success');

    // Trigger state loads
    loadData();
  };

  // Filter books list
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 text-left" id="books-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title / Description */}
        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1 text-blue-800 bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1 text-xs font-bold w-fit mb-2">
              <Library className="w-3.5 h-3.5 text-blue-600" />
              Comprehensive Index
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Open Book Catalog</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Filter through our list of titles and borrow allocations.
            </p>
          </div>
          <div className="bg-slate-50/80 rounded-xl px-4 py-2 border border-slate-100/50 flex items-center gap-4 shrink-0 text-xs font-semibold text-gray-500">
            <div>
              <span className="block text-gray-700 font-extrabold text-sm">{books.length}</span>
              <span>Unique Titles</span>
            </div>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <span className="block text-gray-700 font-extrabold text-sm">
                {books.reduce((acc, curr) => acc + curr.availableCopies, 0)}
              </span>
              <span>In-Stock Books</span>
            </div>
          </div>
        </div>

        {/* Searching & Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs gap-4 mb-8 flex flex-col sm:flex-row items-center justify-between">
          
          {/* Keyword search input */}
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="search-input"
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              placeholder="Search by Title, Author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Dropdown & Toggle Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0 hidden sm:inline" />
            <select
              id="category-selector"
              className="block w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-150">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No books coordinate with your search.</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Try adjusting your query descriptors, checking spellings, or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="book-grid-list">
            {filteredBooks.map((book) => {
              // Calculate if the current book has a active loan by the current user
              const isBorrowedByCurrentUser =
                !!user &&
                records.some(
                  (r) =>
                    r.userId === user.id &&
                    r.bookId === book.id &&
                    (r.status === 'active' || r.status === 'overdue')
                );

              return (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={handleBorrowBook}
                  isBorrowedByCurrentUser={isBorrowedByCurrentUser}
                  isLoggedIn={!!user}
                  userRole={user?.role}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default BooksPage;
