import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiClock, FiMessageCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_COLORS = {
  Technology: 'bg-blue-100 text-blue-700',
  Lifestyle: 'bg-pink-100 text-pink-700',
  Travel: 'bg-green-100 text-green-700',
  Food: 'bg-orange-100 text-orange-700',
  Health: 'bg-teal-100 text-teal-700',
  Business: 'bg-purple-100 text-purple-700',
  Other: 'bg-slate-100 text-slate-700',
};

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
};

export default function PostCard({ post }) {
  const readTime = Math.max(1, Math.ceil((post.content?.replace(/<[^>]+>/g, '').split(' ').length || 0) / 200));
  const colorClass = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other;
  const excerpt = post.content?.replace(/<[^>]+>/g, '').substring(0, 130);
  const featuredImg = resolveImg(post.featuredImage);
  const authorImg = resolveImg(post.author?.profilePicture);

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Image */}
      <Link to={`/post/${post._id}`} className="block overflow-hidden">
        {featuredImg ? (
          <img src={featuredImg} alt={post.title} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <span className="text-5xl">✍️</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Category + read time */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>{post.category}</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <FiClock size={11} /> {readTime} min read
          </span>
        </div>

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h2 className="font-bold text-slate-800 text-lg leading-snug mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{excerpt}...</p>

        {/* Author row */}
        <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-2 mb-4">
          <img
            src={authorImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=3b82f6&color=fff&size=32`}
            alt={post.author?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div>
            <p className="text-xs font-semibold text-slate-700 leading-none">{post.author?.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </Link>

        {/* Stats bar */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-xs font-semibold">
            <FiHeart size={13} />
            <span>{post.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-500 px-3 py-1.5 rounded-full text-xs font-semibold">
            <FiEye size={13} />
            <span>{post.viewCount || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-xs font-semibold">
            <FiMessageCircle size={13} />
            <span>{post.commentCount || 0}</span>
          </div>
          <Link
            to={`/post/${post._id}`}
            className="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
