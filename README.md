# Library Management System

## Project Description

This project is a **Library Management System** web application built with **React**, **TypeScript**, and **Vite**.

The main idea of the project is to create a simple digital library system where users can browse books, create an account, log in, borrow books, and see their borrowed books. The system also includes an admin/librarian side where the admin can manage books and view borrowing records.

This project was created as a frontend web application. It uses browser **localStorage** to save users, books, borrowing records, and the current logged-in session.

---

## Main Features

### Public Features

- Home / landing page
- View available books
- User signup
- User login
- Navigation bar
- Responsive and clean user interface

### User Features

- Protected user dashboard
- Borrow books
- View borrowed books
- See book information such as title, author, category, description, and available copies
- Logout from the system

### Admin Features

- Admin protected dashboard
- Manage library books
- View borrowing records
- Separate admin routes from normal user routes

---

## Technologies Used

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React Icons
- LocalStorage
- Context API

---

## Project Structure

```txt
Library-Management-System/
│
├── src/
│   ├── components/
│   │   ├── AdminRoute.tsx
│   │   ├── BookCard.tsx
│   │   ├── BorrowTable.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── pages/
│   │   ├── AdminBorrowingRecords.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminManageBooks.tsx
│   │   ├── BooksPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MyBorrowedBooks.tsx
│   │   ├── SignUpPage.tsx
│   │   └── UserDashboard.tsx
│   │
│   ├── utils/
│   │   └── storage.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
