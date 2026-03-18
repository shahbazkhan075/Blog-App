import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3, FiGithub, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <FiEdit3 /> BlogSpace
            </Link>
            <p className="text-sm leading-relaxed">A platform for writers and readers to share ideas, stories, and knowledge.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'].map((c) => (
                <li key={c}><Link to={`/?category=${c}`} className="hover:text-white transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} BlogSpace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors"><FiGithub size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><FiTwitter size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
