import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiEdit3 } from 'react-icons/fi';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    dispatch(login(form));
  };

  return (
    <>
      <Helmet><title>Login — BlogSpace</title></Helmet>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
              <FiEdit3 className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your BlogSpace account</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 ${errors.email ? 'border-red-400' : 'border-slate-200'}`} />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 ${errors.password ? 'border-red-400' : 'border-slate-200'}`} />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
