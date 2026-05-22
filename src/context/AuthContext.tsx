import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser, setCurrentUser, getLocalUsers, saveLocalUsers } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, passwordConfirm: string, passwordConfirmMatch: string) => { success: boolean; message: string };
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    // Initial fetch of session
    const current = getCurrentUser();
    setUserState(current);
  }, []);

  const login = (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const users = getLocalUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!foundUser) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (foundUser.password !== password) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Save session
    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      createdAt: foundUser.createdAt,
    };
    setCurrentUser(sessionUser);
    setUserState(sessionUser);

    return { success: true, message: `Welcome back, ${sessionUser.name}!` };
  };

  const signup = (name: string, email: string, password: string, passwordConfirm: string) => {
    if (!name.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim()) {
      return { success: false, message: 'All registration fields are required.' };
    }

    if (password !== passwordConfirm) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const users = getLocalUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (emailExists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'user',
      password: password, // For localStorage login purposes
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveLocalUsers(users);

    return { success: true, message: 'Account created successfully! You can now log in.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setUserState(null);
  };

  const refreshUser = () => {
    const current = getCurrentUser();
    setUserState(current);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
