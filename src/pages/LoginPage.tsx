import React, { useState } from 'react';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookOpen, LogIn, KeyRound, Mail, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect path after logging in
  const from = location.state?.from?.pathname || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect right away
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please fully enter email and password fields.');
      return;
    }

    setIsSubmitting(true);

    const result = login(email, password);

    setIsSubmitting(false);

    if (result.success) {
      showToast(result.message, 'success');
      
      // Select appropriate default redirection based on user credentials
      const currentSession = result.message.includes('Admin') ? 'admin' : 'user';
      if (currentSession === 'admin') {
        navigate('/admin');
      } else {
        navigate(from || '/dashboard');
      }
    } else {
      setErrorMsg(result.message);
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left" id="login-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-3 text-slate-900 font-bold text-2xl tracking-tight">
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-2xl shadow-xs">
              L
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight animate-fade-in">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-medium">
          Or{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            create a new student account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-4 shadow-sm border border-slate-200 rounded-3xl sm:px-10"
        >
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 text-rose-800 text-xs font-semibold rounded-xl border border-rose-100 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-md shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-700 bg-white placeholder-gray-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Password
              </label>
              <div className="mt-1.5 relative rounded-md shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-700 bg-white placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-100"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? 'Verifying...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Quick Admin Credentials Indicator for Easy Testing */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/50 text-[11px] text-blue-900 leading-relaxed">
              <span className="font-extrabold block text-blue-800 uppercase tracking-wider mb-1">
                Default Librarian Admin Credentials
              </span>
              <div className="flex flex-col gap-0.5 text-gray-600 font-medium">
                <p>Email: <strong className="text-gray-800 font-bold select-all">admin@library.com</strong></p>
                <p>Password: <strong className="text-gray-800 font-bold select-all">admin123</strong></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default LoginPage;
