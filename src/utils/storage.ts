import { User, Book, BorrowRecord } from '../types';

const USERS_KEY = 'library_users';
const BOOKS_KEY = 'library_books';
const RECORDS_KEY = 'library_borrow_records';
const SESSION_KEY = 'library_current_user';

const DEFAULT_ADMIN: User = {
  id: 'admin-default',
  name: 'System Admin',
  email: 'admin@library.com',
  role: 'admin',
  createdAt: new Date('2026-01-01').toISOString(),
};

const DEFAULT_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    description: 'A handbook of agile software craftsmanship. Learn to write code that is clean, readable, and highly maintainable, paving the way for professional-grade developer productivity.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
    totalCopies: 5,
    availableCopies: 5,
    createdAt: new Date('2026-05-01T00:00:00Z').toISOString(),
  },
  {
    id: 'book-2',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    category: 'Programming',
    description: 'One of the most significant books on computer programming. It covers topics ranging from personal responsibility and career development to architectural techniques for keeping your code flexible.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    totalCopies: 4,
    availableCopies: 4,
    createdAt: new Date('2026-05-02T00:00:00Z').toISOString(),
  },
  {
    id: 'book-3',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    description: 'An easy and proven way to build good habits and break bad ones. This guide reveals how tiny daily iterations compile to massive long-term life results.',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60',
    totalCopies: 6,
    availableCopies: 6,
    createdAt: new Date('2026-05-03T00:00:00Z').toISOString(),
  },
  {
    id: 'book-4',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'Science',
    description: 'Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical and sometimes devastating breakthroughs of our Cognitive, Agricultural, and Scientific Revolutions.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60',
    totalCopies: 3,
    availableCopies: 3,
    createdAt: new Date('2026-05-04T00:00:00Z').toISOString(),
  },
  {
    id: 'book-5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fiction',
    description: 'A beautiful masterpiece of modern fantasy literature. Follow Bilbo Baggins as he is swept away in an epic quest to reclaim the lost Dwarf Kingdom of Erebor.',
    imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&auto=format&fit=crop&q=60',
    totalCopies: 6,
    availableCopies: 6,
    createdAt: new Date('2026-05-05T00:00:00Z').toISOString(),
  },
  {
    id: 'book-6',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    description: 'Sovereign reflections on Stoic philosophy, self-discipline, death, and human duty, written by the Roman emperor Marcus Aurelius, serving as a powerful compass for a principled life.',
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60',
    totalCopies: 4,
    availableCopies: 4,
    createdAt: new Date('2026-05-06T00:00:00Z').toISOString(),
  }
];

// Helper to get and set
export function getLocalUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLocalUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getLocalBooks(): Book[] {
  const data = localStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLocalBooks(books: Book[]): void {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function getLocalRecords(): BorrowRecord[] {
  const data = localStorage.getItem(RECORDS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLocalRecords(records: BorrowRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Global initialization
export function initializeStorage(): void {
  const users = getLocalUsers();
  // Ensure default admin exists
  const hasAdmin = users.some(u => u.email === DEFAULT_ADMIN.email);
  if (!hasAdmin) {
    // We add admin to database with preconfigured hashless password
    // (As client-side storage, password checking is simplified string equality)
    const adminWithPass = { ...DEFAULT_ADMIN, password: 'admin123' };
    users.push(adminWithPass);
    saveLocalUsers(users);
  }

  // Ensure default books exist
  const books = getLocalBooks();
  if (books.length === 0) {
    saveLocalBooks(DEFAULT_BOOKS);
  }

  // Ensure records are set if empty
  const records = getLocalRecords();
  if (!localStorage.getItem(RECORDS_KEY)) {
    saveLocalRecords([]);
  }
}

// Calculate days remaining or overdue days from due date
export function computeDaysDifference(dueDateString: string, returnedDateString: string | null): {
  days: number;
  isOverdue: boolean;
} {
  const targetDate = returnedDateString ? new Date(returnedDateString) : new Date();
  const dueDate = new Date(dueDateString);
  
  // Set times to midnight to calculate pure days
  targetDate.setHours(0,0,0,0);
  dueDate.setHours(0,0,0,0);

  const diffTime = targetDate.getTime() - dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return { days: diffDays, isOverdue: true };
  } else {
    return { days: Math.abs(diffDays), isOverdue: false };
  }
}
