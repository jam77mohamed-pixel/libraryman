import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { ThemeProvider } from './context/ThemeContext';

import ErrorBoundary from './components/common/ErrorBoundary';

// Layout & Route Guards
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Application Pages
import Dashboard from './pages/dashboard/Dashboard';
import BookList from './pages/books/BookList';
import BookDetails from './pages/books/BookDetails';
import MemberList from './pages/members/MemberList';
import MemberDetails from './pages/members/MemberDetails';
import IssueReturn from './pages/circulation/IssueReturn';
import FineManagement from './pages/fines/FineManagement';
import CategoryManagement from './pages/categories/CategoryManagement';
import GlobalSearch from './pages/search/GlobalSearch';
import Reports from './pages/reports/Reports';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LibraryProvider>
            <ThemeProvider>
              <Routes>
                {/* Public Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Application Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="books" element={<BookList />} />
                  <Route path="books/:id" element={<BookDetails />} />
                  <Route path="members" element={<MemberList />} />
                  <Route path="members/:id" element={<MemberDetails />} />
                  <Route path="circulation" element={<IssueReturn />} />
                  <Route path="fines" element={<FineManagement />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="search" element={<GlobalSearch />} />
                  <Route path="reports" element={<Reports />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Toast Notification Container */}
              <ToastContainer
                position="top-right"
                autoClose={3500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </ThemeProvider>
          </LibraryProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
