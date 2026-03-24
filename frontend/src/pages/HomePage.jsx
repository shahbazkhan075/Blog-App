import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchPostsByCategory, searchPosts } from '../store/slices/postSlice';
import PostCard from '../components/posts/PostCard';
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';
import TrendingPosts from '../components/posts/TrendingPosts';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiX } from 'react-icons/fi';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business'];

export default function HomePage() {
  const dispatch = useDispatch();
  const { posts, isLoading, pagination } = useSelector((s) => s.posts);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    if (query) dispatch(searchPosts({ q: query, page }));
    else if (category === 'All') dispatch(fetchPosts({ page }));
    else dispatch(fetchPostsByCategory({ category, page }));
  }, [dispatch, query, category, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchInput.trim());
    setPage(1);
    setCategory('All');
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchInput('');
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setQuery('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <>
      <Helmet><title>BlogSpace — Discover Stories</title></Helmet>

      {/* Hero */}
      <div className="relative overflow-hidden text-white py-24 px-4" style={{ background: 'linear-gradient(to right, #000000, #152331)' }}>
        {/* Gradient orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            ✦ Your Creative Space
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight bg-gradient-to-br from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent">
            Discover Amazing Stories
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Read, write, and connect with writers from around the world.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 backdrop-blur-sm"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition text-sm shadow-lg shadow-blue-900/40">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Trending Posts */}
        {!query && category === 'All' && page === 1 && <TrendingPosts />}

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => handleCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === c && !query
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Search result header */}
        {query && (
          <div className="flex items-center gap-3 mb-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Showing results for "<span className="font-semibold text-slate-700 dark:text-slate-200">{query}</span>"
            </p>
            <button onClick={handleClearSearch} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition">
              <FiX size={14} /> Clear
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)
            : posts.length > 0
              ? posts.map((p) => <PostCard key={p._id} post={p} />)
              : <EmptyState query={query} category={category} />
          }
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition">
              ← Prev
            </button>
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))} disabled={page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition">
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState({ query, category }) {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">{query ? '🔍' : '📭'}</div>
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
        {query ? `No results for "${query}"` : `No posts in ${category}`}
      </h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs">
        {query
          ? 'Try different keywords or browse by category.'
          : 'Be the first to write something here.'}
      </p>
    </div>
  );
}
