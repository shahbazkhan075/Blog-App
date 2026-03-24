import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiMail, FiLock, FiEdit3 } from 'react-icons/fi';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  const field = (key, label, type, icon, placeholder) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 ${errors[key] ? 'border-red-400' : 'border-slate-200'}`} />
      </div>
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <Helmet><title>Sign Up — BlogSpace</title></Helmet>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
              <FiEdit3 className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join thousands of writers on BlogSpace</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {field('name', 'Full Name', 'text', <FiUser />, 'John Doe')}
              {field('email', 'Email', 'email', <FiMail />, 'you@example.com')}
              {field('password', 'Password', 'password', <FiLock />, '••••••••')}
              {field('confirm', 'Confirm Password', 'password', <FiLock />, '••••••••')}

              <button type="submit" disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
