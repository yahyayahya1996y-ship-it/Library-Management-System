import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookOpen, UserPlus, KeyRound, Mail, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const SignUpPage: React.FC = () => {
  const { user, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Inputs state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to respective home
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(''); // Clear errors when typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field completion checks
    if (!formData.name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (!formData.password) {
      setErrorMsg('Password is required.');
      return;
    }
    if (formData.password.length < 5) {
      setErrorMsg('Password should be at least 5 characters long.');
      return;
    }
    if (!formData.confirmPassword) {
      setErrorMsg('Please confirm your password.');
      return;
    }

    setIsSubmitting(true);

    const result = signup(formData.name, formData.email, formData.password, formData.confirmPassword);
    
    setIsSubmitting(false);

    if (result.success) {
      showToast(result.message, 'success');
      navigate('/login');
    } else {
      setErrorMsg(result.message);
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left" id="signup-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header Icon */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-3 text-slate-900 font-bold text-2xl tracking-tight">
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-2xl shadow-xs">
              L
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
          Create library account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-medium">
          Or{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            sign In to existing account
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
              <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label htmlFor="name-input" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Full Name
              </label>
              <div className="mt-1.5 relative rounded-md shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  id="name-input"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-700 bg-white placeholder-gray-400"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email-input" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-md shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-700 bg-white placeholder-gray-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password-input" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Password
              </label>
              <div className="mt-1.5 relative rounded-md shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-700 bg-white placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirm-password-input" className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="mt-1.5 relative rounded-md shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  id="confirm-password-input"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-700 bg-white placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-100"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
export default SignUpPage;
