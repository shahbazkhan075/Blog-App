import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, deleteComment } from '../../store/slices/commentSlice';
import { FiTrash2, FiSend } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const resolveImg = (url) => { if (!url) return ''; if (url.startsWith('http')) return url; return `${BACKEND_URL}${url}`; };

export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const { comments, isLoading } = useSelector((s) => s.comments);
  const { user } = useSelector((s) => s.auth);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!text.trim()) return toast.error('Comment cannot be empty');
    setSubmitting(true);
    try {
      await dispatch(addComment({ postId, comment: text.trim() })).unwrap();
      setText('');
      toast.success('Comment added!');
    } catch { toast.error('Failed to add comment'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await dispatch(deleteComment(id)).unwrap();
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete comment'); }
  };

  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Comments <span className="text-blue-600">({comments.length})</span>
      </h3>

      {/* Add comment */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <img src={resolveImg(user.profilePicture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
            alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1" />
          <div className="flex-1">
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                <FiSend size={14} /> {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-blue-50 rounded-xl text-sm text-blue-700 text-center">
          <a href="/login" className="font-semibold underline">Login</a> to join the conversation
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-slate-400 py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-5">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <img src={resolveImg(c.userId?.profilePicture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.userId?.name || 'U')}&background=e2e8f0&color=475569&size=40`}
                alt={c.userId?.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{c.userId?.name}</span>
                    <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                  </div>
                  {user && user._id === c.userId?._id && (
                    <button onClick={() => handleDelete(c._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
