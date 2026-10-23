import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

const AuthContext = createContext(null);

const AUTH_USER_KEY = 'library_user_v2';
const REGISTERED_USERS_KEY = 'library_registered_users_v2';

// Static administrator account
const DEFAULT_USERS = [
  {
    id: 'u-admin',
    name: 'Sarah Jenkins',
    email: 'admin@library.com',
    password: 'password123',
    role: 'Library Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = getStorageItem(AUTH_USER_KEY, 'uninitialized');
    if (saved === 'uninitialized') {
      setStorageItem(AUTH_USER_KEY, DEFAULT_USERS[0]);
      return DEFAULT_USERS[0];
    }
    return saved;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize default demo users in storage if not existing
    const existing = getStorageItem(REGISTERED_USERS_KEY, null);
    if (!existing) {
      setStorageItem(REGISTERED_USERS_KEY, DEFAULT_USERS);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate slight authentic network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = getStorageItem(REGISTERED_USERS_KEY, DEFAULT_USERS);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password. Please verify credentials.');
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role || 'Staff Librarian',
      avatar: found.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(found.name)}&background=4f46e5&color=fff`,
      token: 'jwt-mock-session-' + Date.now(),
      loginTime: new Date().toISOString(),
    };

    setUser(sessionUser);
    setStorageItem(AUTH_USER_KEY, sessionUser);
    return sessionUser;
  };

  const register = async (name, email, password, role = 'Librarian Staff') => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = getStorageItem(REGISTERED_USERS_KEY, DEFAULT_USERS);
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: 'u-' + Date.now(),
      name,
      email,
      password,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`,
    };

    const updatedUsers = [...users, newUser];
    setStorageItem(REGISTERED_USERS_KEY, updatedUsers);

    // Auto login registered user
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      token: 'jwt-mock-session-' + Date.now(),
      loginTime: new Date().toISOString(),
    };

    setUser(sessionUser);
    setStorageItem(AUTH_USER_KEY, sessionUser);
    return sessionUser;
  };

  const resetPassword = async (email, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const users = getStorageItem(REGISTERED_USERS_KEY, DEFAULT_USERS);
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      throw new Error('No account found with this email address.');
    }

    users[userIndex].password = newPassword;
    setStorageItem(REGISTERED_USERS_KEY, users);
    return true;
  };

  const logout = () => {
    setUser(null);
    removeStorageItem(AUTH_USER_KEY);
  };

  const updateUserProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    setStorageItem(AUTH_USER_KEY, updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        resetPassword,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
