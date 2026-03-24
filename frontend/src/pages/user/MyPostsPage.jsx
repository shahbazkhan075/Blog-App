import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPosts, deletePost } from '../../store/slices/postSlice';
import { Helmet } from 'react-helmet-async';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiPlus, FiHeart } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function MyPostsPage() {
  const dispatch = useDispatch();
  const { myPosts, isLoading, pagination } = useSelector((s) => s.posts);
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchMyPosts({ page })); }, [dispatch, page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await dispatch(deletePost(id)).unwrap(); toast.success('Post deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Helmet><title>My Posts — BlogSpace</title></Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Posts</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your published posts and drafts</p>
          </div>
          <Link to="/create-post" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
            <FiPlus /> New Post
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100">
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : myPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">No posts yet</p>
            <Link to="/create-post" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myPosts.map((post) => (
              <div key={post._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex items-start gap-4 hover:shadow-sm transition">
                {post.featuredImage && (
                  <img src={post.featuredImage} alt={post.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 hidden sm:block" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {post.isPublished ? <><FiEye className="inline mr-1" />Published</> : <><FiEyeOff className="inline mr-1" />Draft</>}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{post.category}</span>
                  </div>
                  <Link to={`/post/${post._id}`}>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 transition truncate">{post.title}</h3>
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                    <span className="flex items-center gap-1"><FiEye size={11} /> {post.viewCount || 0}</span>
                    <span className="flex items-center gap-1"><FiHeart size={11} /> {post.likes?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/edit-post/${post._id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <FiEdit2 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(post._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">← Prev</button>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">{page} / {pagination.pages}</span>
            <button onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))} disabled={page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">Next →</button>
          </div>
        )}
      </div>
    </>
  );
}
