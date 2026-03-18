import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchPostsByCategory, searchPosts } from '../store/slices/postSlice';
import PostCard from '../components/posts/PostCard';
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';
import { Helmet } from 'react-helmet-async';
import { FiSearch } from 'react-icons/fi';

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
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Discover Amazing Stories</h1>
          <p className="text-blue-100 text-lg mb-8">Read, write, and connect with writers from around the world.</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
            <button type="submit" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => handleCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === c && !query ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Results header */}
        {query && <p className="text-slate-500 text-sm mb-6">Showing results for "<span className="font-semibold text-slate-700">{query}</span>"</p>}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)
            : posts.length > 0
              ? posts.map((p) => <PostCard key={p._id} post={p} />)
              : <div className="col-span-3 text-center py-20 text-slate-400">No posts found.</div>
          }
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
              ← Prev
            </button>
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))} disabled={page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
