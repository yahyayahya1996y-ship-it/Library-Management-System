import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookOpen, LogOut, Menu, X, User as UserIcon, Shield, LayoutDashboard, Bookmark, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Nav links builder based on user role
  const renderNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link
            to="/books"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/books') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Browse Books
          </Link>
          <Link
            to="/login"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/login') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign Up
          </Link>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <Link
            to="/admin"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/admin') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </Link>
          <Link
            to="/admin/books"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/admin/books') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Manage Books
          </Link>
          <Link
            to="/admin/records"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/admin/records') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Borrowing Records
          </Link>
        </>
      );
    }

    // Default authenticated normal user
    return (
      <>
        <Link
          to="/books"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive('/books') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Browse Books
        </Link>
        <Link
          to="/dashboard"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
            isActive('/dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          to="/my-borrowed"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
            isActive('/my-borrowed') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          My Borrowed Books
        </Link>
      </>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-xs sticky top-0 z-40" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 text-slate-900 font-bold text-xl tracking-tight transition-transform active:scale-95">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-xs">
                L
              </div>
              <span className="hidden sm:inline font-bold tracking-tight text-slate-900">Library<span className="text-blue-600">LMS</span></span>
              <span className="sm:hidden text-slate-900 font-bold">L<span className="text-blue-600">MS</span></span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            {renderNavLinks()}

            {user && (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-50 rounded-full text-gray-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 font-medium leading-none">Logged in as</p>
                    <p className="text-sm text-gray-700 font-semibold leading-relaxed truncate max-w-[120px]" title={user.name}>
                      {user.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col gap-1">
            {/* Direct pages */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2 ${
                        isActive('/admin') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-blue-500" /> Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/books"
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2 ${
                        isActive('/admin/books') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Settings className="w-4 h-4 text-blue-500" /> Manage Books
                    </Link>
                    <Link
                      to="/admin/records"
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2 ${
                        isActive('/admin/records') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 text-blue-500" /> Borrowing Records
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/books"
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-base font-medium ${
                        isActive('/books') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Browse Books
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2 ${
                        isActive('/dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-500" /> Dashboard
                    </Link>
                    <Link
                      to="/my-borrowed"
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2 ${
                        isActive('/my-borrowed') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 text-blue-500" /> My Borrowed Books
                    </Link>
                  </>
                )}
                {/* Profile detail in mobile */}
                <div className="pt-4 pb-2 border-t border-slate-100 flex items-center justify-between px-3 mt-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-semibold rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/books"
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/books') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Browse Books
                </Link>
                <div className="flex flex-col gap-2 pt-2 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 bg-slate-50 text-slate-700 font-medium rounded-lg text-base hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-base hover:bg-blue-700 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
