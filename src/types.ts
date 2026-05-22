export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security / session models
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnedDate: string | null;
  status: 'active' | 'returned' | 'overdue';
}
