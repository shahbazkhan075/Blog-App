import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiEdit3, FiMenu, FiX, FiUser, FiLogOut, FiFileText } from 'react-icons/fi';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const resolveImg = (url) => { if (!url) return ''; if (url.startsWith('http')) return url; return `${BACKEND_URL}${url}`; };

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <FiEdit3 className="text-2xl" />
            <span>BlogSpace</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
            {user ? (
              <>
                <Link to="/create-post" className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                  <FiEdit3 /> Write
                </Link>
                <div className="relative">
                  <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-2">
                    <img src={resolveImg(user.profilePicture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
                      alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-200" />
                  </button>
                  {dropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link to={`/profile/${user._id}`} onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <FiUser /> Profile
                      </Link>
                      <Link to="/my-posts" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <FiFileText /> My Posts
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-slate-600" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setOpen(false)} className="block text-slate-700 font-medium">Home</Link>
          {user ? (
            <>
              <Link to="/create-post" onClick={() => setOpen(false)} className="block text-blue-600 font-medium">Write Post</Link>
              <Link to={`/profile/${user._id}`} onClick={() => setOpen(false)} className="block text-slate-700 font-medium">Profile</Link>
              <Link to="/my-posts" onClick={() => setOpen(false)} className="block text-slate-700 font-medium">My Posts</Link>
              <button onClick={handleLogout} className="block text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block text-slate-700 font-medium">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block text-blue-600 font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
