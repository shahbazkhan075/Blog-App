import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTrending } from '../../store/slices/postSlice';
import { FiTrendingUp, FiEye, FiHeart } from 'react-icons/fi';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const resolveImg = (url) => { if (!url) return ''; if (url.startsWith('http')) return url; return `${BACKEND_URL}${url}`; };

const CATEGORY_COLORS = {
  Technology: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Lifestyle: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Travel: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Health: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  Business: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

export default function TrendingPosts() {
  const dispatch = useDispatch();
  const { trendingPosts } = useSelector((s) => s.posts);

  useEffect(() => { dispatch(fetchTrending()); }, [dispatch]);

  if (!trendingPosts?.length) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-orange-500" size={20} />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Trending Now</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {trendingPosts.map((post, i) => {
          const img = resolveImg(post.featuredImage);
          const colorClass = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other;
          return (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="flex-shrink-0 w-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="relative">
                {img ? (
                  <img src={img} alt={post.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                    <span className="text-4xl">✍️</span>
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  #{i + 1}
                </span>
              </div>
              <div className="p-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{post.category}</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mt-2 line-clamp-2 leading-snug">{post.title}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><FiEye size={11} />{post.viewCount || 0}</span>
                  <span className="flex items-center gap-1"><FiHeart size={11} />{post.likes?.length || 0}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
