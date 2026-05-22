import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Book, BorrowRecord, User } from '../types';
import {
  getLocalBooks,
  getLocalRecords,
  getLocalUsers,
  computeDaysDifference,
} from '../utils/storage';
import {
  BookOpen,
  Users,
  Inbox,
  AlertTriangle,
  Library,
  BookMarked,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const allBooks = getLocalBooks();
    const allRecords = getLocalRecords();
    const allUsers = getLocalUsers();

    setBooks(allBooks);
    setRecords(allRecords);
    setUsers(allUsers);
  }, []);

  // Compute stats
  const uniqueTitlesCount = books.length;
  
  const totalAvailableCount = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const totalStockCount = books.reduce((sum, b) => sum + b.totalCopies, 0);
  
  // Borrowed count = total stock - total available OR count of active/overdue borrow records
  // Standard full borrowed copies tracking
  const activeRecords = records.filter((r) => r.status === 'active' || r.status === 'overdue');
  const totalBorrowedCopies = activeRecords.length;

  // Overdues count
  const overdueCount = activeRecords.filter((r) => {
    const { isOverdue } = computeDaysDifference(r.dueDate, null);
    return isOverdue;
  }).length;

  // User accounts count (excluding admin role)
  const registeredUsersCount = users.filter((u) => u.role === 'user').length;

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 text-left" id="admin-dashboard-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs">
          <div>
            <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1 text-xs font-bold w-fit mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
              Administrative Interface
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Library Administration Console
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-1">
              Complete controls for catalog configuration, inventory allocations, and member auditing logs.
            </p>
          </div>
          <div className="text-xs text-blue-700 bg-blue-50 border border-blue-100 font-bold rounded-2xl p-4 shrink-0 max-w-xs">
            <span className="block font-black text-sm text-blue-800 text-uppercase tracking-wider">LIBRARIAN ROOT</span>
            <span>Welcome, {user?.name || 'System Administrator'}</span>
          </div>
        </div>

        {/* Dashboard widgets grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <DashboardCard
            title="Total Titles"
            value={uniqueTitlesCount}
            icon={BookMarked}
            colorScheme="indigo"
            subtext="Distinct book types"
          />
          <DashboardCard
            title="Stock Available"
            value={totalAvailableCount}
            icon={Library}
            colorScheme="emerald"
            subtext={`out of ${totalStockCount} total copies`}
          />
          <DashboardCard
            title="Active Borrowed"
            value={totalBorrowedCopies}
            icon={Inbox}
            colorScheme="blue"
            subtext="Currently checked out"
          />
          <DashboardCard
            title="Overdue Audits"
            value={overdueCount}
            icon={AlertTriangle}
            colorScheme="rose"
            subtext="Require returns"
          />
          <DashboardCard
            title="Registered Users"
            value={registeredUsersCount}
            icon={Users}
            colorScheme="blue"
            subtext="Students & users log"
          />
        </div>

        {/* Action Shortcuts panels */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Quick item catalog curation card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs flex flex-col justify-between items-start text-left">
            <div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 w-fit mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">Book Inventory Curation</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Add pristine new book allocations, upload description content, host cover image URLs, adjust stock copies, edit title profiles or delete items from the registry safely.
              </p>
            </div>
            <Link
              to="/admin/books"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Curation Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick borrowing audits panel */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs flex flex-col justify-between items-start text-left">
            <div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 w-fit mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">Borrowing Log Board</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Audit system-wide student actions. Search loans by student name, query active emails, or book subjects. Filter statuses to see returned listings or track overdue days easily.
              </p>
            </div>
            <Link
              to="/admin/records"
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Auditing Center <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
export default AdminDashboard;
