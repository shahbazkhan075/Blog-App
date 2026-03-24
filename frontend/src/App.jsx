import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import BackToTop from './components/common/BackToTop';
import PageTransition from './components/common/PageTransition';
import HomePage from './pages/HomePage';
import SinglePostPage from './pages/SinglePostPage';
import CreateEditPostPage from './pages/CreateEditPostPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import MyPostsPage from './pages/user/MyPostsPage';

export default function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/post/:id" element={<SinglePostPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/create-post" element={<ProtectedRoute><CreateEditPostPage /></ProtectedRoute>} />
                  <Route path="/edit-post/:id" element={<ProtectedRoute><CreateEditPostPage /></ProtectedRoute>} />
                  <Route path="/my-posts" element={<ProtectedRoute><MyPostsPage /></ProtectedRoute>} />
                </Routes>
              </PageTransition>
            </main>
            <Footer />
            <BackToTop />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#1e293b', color: '#f8fafc', borderRadius: '10px' },
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}
