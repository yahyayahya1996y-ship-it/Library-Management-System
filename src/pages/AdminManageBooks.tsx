import React, { useEffect, useState } from 'react';
import { Book, BorrowRecord } from '../types';
import {
  getLocalBooks,
  saveLocalBooks,
  getLocalRecords,
} from '../utils/storage';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Edit2,
  Trash2,
  Image,
  Tag,
  BookOpen,
  Calendar,
  AlertCircle,
  X,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const AdminManageBooks: React.FC = () => {
  const { showToast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);

  // Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Programming',
    description: '',
    imageUrl: '',
    totalCopies: 1,
  });

  // Deletion confirm modal state
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  const loadData = () => {
    setBooks(getLocalBooks());
    setRecords(getLocalRecords());
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: 'Programming',
      description: '',
      imageUrl: '',
      totalCopies: 1,
    });
    setEditingBook(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      imageUrl: book.imageUrl,
      totalCopies: book.totalCopies,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Safe checks for active loans of a book type
  const getBorrowedCount = (bookId: string) => {
    return records.filter((r) => r.bookId === bookId && (r.status === 'active' || r.status === 'overdue')).length;
  };

  // Submit handler (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim() || !formData.imageUrl.trim()) {
      showToast('Please fill in Title, Author, and Image URL.', 'error');
      return;
    }

    const allBooks = getLocalBooks();

    if (editingBook) {
      // EDIT MODE
      const index = allBooks.findIndex((b) => b.id === editingBook.id);
      if (index === -1) {
        showToast('Selected book not found to edit.', 'error');
        return;
      }

      const activeLoans = getBorrowedCount(editingBook.id);
      
      // Validation Check: Total copies cannot be less than currently borrowed copies.
      if (formData.totalCopies < activeLoans) {
        showToast(`Cannot set total stock to ${formData.totalCopies}. There are currently ${activeLoans} active student loans.`, 'error');
        return;
      }

      // Calculate new available copies based on change in total copies
      // formula: newAvailable = newTotal - activeLoans
      const newAvailable = formData.totalCopies - activeLoans;

      allBooks[index] = {
        ...editingBook,
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        totalCopies: formData.totalCopies,
        availableCopies: newAvailable,
      };

      saveLocalBooks(allBooks);
      showToast(`Successfully updated "${formData.title}" details.`, 'success');
    } else {
      // ADD MODE
      const newBook: Book = {
        id: 'book-' + Math.random().toString(36).substr(2, 9),
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        totalCopies: formData.totalCopies,
        availableCopies: formData.totalCopies, // available automatically equals total for new additions
        createdAt: new Date().toISOString(),
      };

      allBooks.push(newBook);
      saveLocalBooks(allBooks);
      showToast(`Successfully added "${formData.title}" to the library registry!`, 'success');
    }

    setIsModalOpen(false);
    resetForm();
    loadData();
  };

  // Delete Book validation triggers
  const handleDeleteTrigger = (bookId: string) => {
    const activeLoans = getBorrowedCount(bookId);
    if (activeLoans > 0) {
      showToast(`Cannot delete book. There are currently ${activeLoans} active copies on loan.`, 'error');
      return;
    }
    setDeletingBookId(bookId);
  };

  const handleConfirmDelete = () => {
    if (!deletingBookId) return;

    const allBooks = getLocalBooks();
    const filtered = allBooks.filter((b) => b.id !== deletingBookId);
    
    saveLocalBooks(filtered);
    showToast('Book successfully deleted from the library catalog.', 'success');
    setDeletingBookId(null);
    loadData();
  };

  // Fast Stock controls adjustment triggers (+/-)
  const adjustStock = (bookId: string, action: 'increment' | 'decrement') => {
    const allBooks = getLocalBooks();
    const index = allBooks.findIndex((b) => b.id === bookId);
    
    if (index === -1) return;

    const book = allBooks[index];
    const activeLoans = getBorrowedCount(bookId);

    if (action === 'increment') {
      book.totalCopies += 1;
      book.availableCopies += 1;
      
      allBooks[index] = book;
      saveLocalBooks(allBooks);
      showToast(`Added 1 copy stock to "${book.title}".`, 'success');
    } else {
      // Action: Decrement
      if (book.totalCopies <= activeLoans) {
        showToast(`Cannot reduce stock. All ${activeLoans} copies are currently checked out.`, 'error');
        return;
      }
      
      if (book.availableCopies <= 0) {
        showToast('Available copies is already at minimum relative to active loans.', 'error');
        return;
      }

      book.totalCopies -= 1;
      book.availableCopies -= 1;

      allBooks[index] = book;
      saveLocalBooks(allBooks);
      showToast(`Removed 1 copy stock from "${book.title}".`, 'info');
    }

    loadData();
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 text-left" id="admin-manage-books-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title header */}
        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1 text-xs font-bold w-fit mb-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Catalogue Management
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Manage Library Books</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Create new book listings, edit descriptions, change stockpiles, or delete files based on loan availability.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4.5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md hover:shadow-blue-50/50 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Book
          </button>
        </div>

        {/* Books listing table or blank state */}
        {books.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-150 shadow-3xs">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Your library inventory is totally empty.</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6 max-w-sm mx-auto">
              Click the button above to seed, host, and publish your first book!
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-150 rounded-2xl shadow-3xs overflow-hidden">
            {/* Table layout for wide devices */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">Book profile</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Levels</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Available / Loaned</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map((book) => {
                    const activeLoans = getBorrowedCount(book.id);
                    return (
                      <tr key={book.id} className="hover:bg-gray-50/20 transition-colors">
                        
                        {/* Book Title / Image column */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                              <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&auto=format&fit=crop&q=60';
                                }}
                              />
                            </div>
                            <div className="max-w-[220px]">
                              <p className="font-bold text-gray-900 text-sm truncate" title={book.title}>{book.title}</p>
                              <p className="text-gray-400 text-xs truncate">by {book.author}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-850 border border-blue-100">
                            <Tag className="w-2.5 h-2.5 text-blue-600" />
                            {book.category}
                          </span>
                        </td>

                        {/* Total copy stock control incrementor inputs */}
                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 bg-gray-50 rounded-xl p-1 border">
                            <button
                              onClick={() => adjustStock(book.id, 'decrement')}
                              className="p-1 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Decrease stockpile total copies"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold text-gray-800 px-1">{book.totalCopies}</span>
                            <button
                              onClick={() => adjustStock(book.id, 'increment')}
                              className="p-1 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Increase stockpile total copies"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        {/* Available relative to active loans indicator */}
                        <td className="p-4">
                          <div className="text-xs">
                            <p className="font-semibold text-gray-700">
                              Available: <span className="text-emerald-600 font-extrabold">{book.availableCopies}</span> / {book.totalCopies}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              On loan: <span className={activeLoans > 0 ? 'text-blue-600 font-semibold' : ''}>{activeLoans} checked-out</span>
                            </p>
                          </div>
                        </td>

                        {/* Actions buttons */}
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleOpenEdit(book)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit book profiling"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrigger(book.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete book listing"
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

      </div>

      {/* Slide-In Modal Overlay for Add / Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-3xs flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border max-w-lg w-full relative"
            >
              
              {/* Modal Head banner */}
              <div className="bg-gray-50 border-b border-gray-100 p-5 flex justify-between items-center text-left">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-gray-900 text-base">
                      {editingBook ? 'Edit Book Information' : 'Add New Book Allocation'}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-medium">Configure descriptions, genres and stock metrics</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form panel body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
                
                {/* Book Title */}
                <div>
                  <label htmlFor="book-title" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white placeholder-gray-450 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="e.g. Clean Code"
                  />
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="book-author" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-author"
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white placeholder-gray-450 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="e.g. Robert C. Martin"
                  />
                </div>

                {/* Category & Total stock side-by-side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-category" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Category
                    </label>
                    <select
                      id="book-category"
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Philosophy">Philosophy</option>
                      <option value="Science">Science</option>
                      <option value="Self-Help">Self-Help</option>
                      <option value="Fiction">Fiction</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="book-copies" className="block text-xs font-bold text-gray-650 uppercase tracking-wide">
                      Total StockCopies
                    </label>
                    <input
                      id="book-copies"
                      type="number"
                      min="1"
                      required
                      value={formData.totalCopies}
                      onChange={(e) => setFormData((p) => ({ ...p, totalCopies: parseInt(e.target.value) || 1 }))}
                      className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Cover Image Link */}
                <div>
                  <label htmlFor="book-cover" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Cover Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-cover"
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white placeholder-gray-450 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="book-desc" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Description Content
                  </label>
                  <textarea
                    id="book-desc"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-gray-700 bg-white placeholder-gray-450 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="Write a brief, summaries overview of the book's contents, theme, or syllabus coverage..."
                  />
                </div>

                {/* Submit panel */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border text-xs font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-colors cursor-pointer"
                  >
                    {editingBook ? 'Save Changes' : 'Publish Book'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom confirm delete warning modal */}
      <AnimatePresence>
        {deletingBookId && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-3xs flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border p-6 max-w-sm w-full shadow-2xl relative text-left"
            >
              <div className="p-3 bg-red-50 text-red-500 rounded-xl w-fit mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Are you absolutely sure?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                This action is irreversible. It will delete this book from the library records, and remove its trace from catalogue listings.
              </p>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeletingBookId(null)}
                  className="px-4 py-2 border text-xs font-semibold text-gray-500 bg-white hover:bg-gray-50 rounded-xl transition-colors"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Yes, Delete Book
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default AdminManageBooks;
