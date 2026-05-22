/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';

// Page Imports
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import UserDashboard from './pages/UserDashboard';
import MyBorrowedBooks from './pages/MyBorrowedBooks';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageBooks from './pages/AdminManageBooks';
import AdminBorrowingRecords from './pages/AdminBorrowingRecords';

// Route guards
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            {/* Navigation Header */}
            <Navbar />

            {/* Main viewports container */}
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/books" element={<BooksPage />} />

                {/* Normal Student user routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-borrowed"
                  element={
                    <ProtectedRoute>
                      <MyBorrowedBooks />
                    </ProtectedRoute>
                  }
                />

                {/* Admin librarian routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/books"
                  element={
                    <AdminRoute>
                      <AdminManageBooks />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/records"
                  element={
                    <AdminRoute>
                      <AdminBorrowingRecords />
                    </AdminRoute>
                  }
                />

                {/* Catch all fallback redirects */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-150 py-5 text-center text-xs text-gray-400 font-bold mt-auto">
              <p>© 2026 Library Management System. Local Storage Engine. Standard Edition.</p>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

