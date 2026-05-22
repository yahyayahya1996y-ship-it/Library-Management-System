import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { getLocalBooks, initializeStorage } from '../utils/storage';
import { BookOpen, ShieldCheck, ArrowRight, Library, Shield, Clock, BookMarked } from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Initialize storage if needed
    initializeStorage();
    const books = getLocalBooks();
    // Slice first 3 books for display
    setFeaturedBooks(books.slice(0, 3));
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen text-gray-800" id="landing-page-container">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-150 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Hero text */}
            <div className="md:col-span-7 flex flex-col items-start text-left z-10">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-800 bg-blue-50 border border-blue-100 uppercase tracking-widest mb-6"
              >
                <Library className="w-3.5 h-3.5 text-blue-600" />
                Empowering Minds
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6"
              >
                Your Gateway to <br />
                <span className="text-blue-600">Infinite Knowledge</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mb-8"
              >
                Welcome to the official <strong className="text-gray-700 font-semibold">Library Management System</strong>. Browse, checkout, and keep track of premier digital book assets, modern design systems, programming literature, and timeless philosophy texts right from your dashboard.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold rounded-xl shadow-xs transition-all"
                >
                  Create Account
                </Link>
              </motion.div>
            </div>

            {/* Hero Visual Block */}
            <div className="md:col-span-5 relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative bg-white p-6 rounded-3xl border border-gray-150 shadow-xl max-w-sm w-full relative"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-100 rounded-2xl -z-10 rotate-12"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-slate-100 rounded-3xl -z-10 -rotate-12"></div>

                <div className="aspect-[3/4] bg-linear-to-tr from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between p-6 border border-blue-100/50">
                  <div className="flex justify-between items-start">
                    <BookMarked className="w-8 h-8 text-blue-600" />
                    <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      SYSTEM PREVIEW
                    </span>
                  </div>

                  <div className="text-left mt-8">
                    <h3 className="font-extrabold text-gray-900 text-xl leading-snug">The Professional Librarian</h3>
                    <p className="text-gray-400 text-xs mt-1 font-medium">Standard Edition</p>
                    <div className="mt-4 flex items-center gap-1">
                      <div className="w-4 h-1 bg-blue-500 rounded-full"></div>
                      <div className="w-2.5 h-1 bg-blue-300 rounded-full"></div>
                      <div className="w-1.5 h-1 bg-blue-200 rounded-full"></div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div>
                      <span className="block font-semibold text-gray-700 text-sm">14 Days</span>
                      <span>Borrow Duration</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-gray-700 text-sm">Instant</span>
                      <span>Access Log</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature stats / explanation cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Structured Borrowing & Automation</h2>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            Our library architecture makes borrowing books automated and returns completely error-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-start text-left">
            <div className="p-3 bg-blue-50 rounded-xl mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">1. Explore Catalog</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Browse our dynamically updated list of modern titles. Filter using category tags or search instantly across authors or book descriptions.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-150 shadow-xs flex flex-col items-start text-left">
            <div className="p-3 bg-blue-50 rounded-xl mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">2. Check Out for 14 Days</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              If an allocation is available in stock, borrow it with a simple click. Retain titles for up to 14 days with precise return deadline counters on your dashboard.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-150 shadow-xs flex flex-col items-start text-left">
            <div className="p-3 bg-emerald-50 rounded-xl mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">3. Clean Return Safeguards</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Return books in one click to restock inventory list. Admin dashboards allow our librarians to manage stock levels, insert new assets, and audit overdue listings.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Book Catalog Teaser */}
      {featuredBooks.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Featured Selections</h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">A sneak peek at some of the popular literature available right now.</p>
            </div>
            <Link
              to="/books"
              className="group inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              See all books
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-150 p-4 shadow-3xs flex gap-4 text-left"
              >
                <div className="w-20 h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0 shadow-3xs border">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between py-1 min-w-0 flex-1">
                  <div>
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-100 w-fit block">
                      {book.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mt-1.5 truncate" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-xs font-semibold truncate">by {book.author}</p>
                    <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed mt-1">{book.description}</p>
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    Available: <span className="font-semibold text-gray-700">{book.availableCopies} copies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default LandingPage;
