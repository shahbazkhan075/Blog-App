import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, toggleLike, deletePost } from '../store/slices/postSlice';
import { fetchComments, clearComments } from '../store/slices/commentSlice';
import CommentSection from '../components/comments/CommentSection';
import { Helmet } from 'react-helmet-async';
import { FiHeart, FiEye, FiEdit2, FiTrash2, FiShare2, FiClock, FiArrowLeft } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const resolveImg = (url) => { if (!url) return ''; if (url.startsWith('http')) return url; return `${BACKEND_URL}${url}`; };

export default function SinglePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost, isLoading } = useSelector((s) => s.posts);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchComments(id));
    return () => dispatch(clearComments());
  }, [dispatch, id]);

  const handleLike = () => {
    if (!user) return toast.error('Login to like posts');
    dispatch(toggleLike(id));
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await dispatch(deletePost(id)).unwrap();
      toast.success('Post deleted');
      navigate('/');
    } catch { toast.error('Failed to delete'); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (isLoading || !currentPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-8" />
        <div className="h-72 bg-slate-200 rounded-2xl mb-8" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-slate-200 rounded mb-3" />)}
      </div>
    );
  }

  const isAuthor = user && user._id === currentPost.author?._id;
  const liked = currentPost.likes?.includes(user?._id);
  const readTime = Math.max(1, Math.ceil((currentPost.content?.replace(/<[^>]+>/g, '').split(' ').length || 0) / 200));

  return (
    <>
      <Helmet>
        <title>{currentPost.title} — BlogSpace</title>
        <meta name="description" content={currentPost.content?.replace(/<[^>]+>/g, '').substring(0, 160)} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm mb-6 transition-colors">
          <FiArrowLeft /> Back
        </button>

        {/* Featured image */}
        {resolveImg(currentPost.featuredImage) && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
            <img src={resolveImg(currentPost.featuredImage)} alt={currentPost.title} className="w-full max-h-[480px] object-cover" />
          </div>
        )}

        {/* Category + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{currentPost.category}</span>
          {currentPost.tags?.map((t) => (
            <span key={t} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">#{t}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">{currentPost.title}</h1>

        {/* Author row */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-100 mb-8">
          <Link to={`/profile/${currentPost.author?._id}`} className="flex items-center gap-3">
            <img src={resolveImg(currentPost.author?.profilePicture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentPost.author?.name || 'U')}&background=3b82f6&color=fff`}
              alt={currentPost.author?.name} className="w-11 h-11 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-slate-800 text-sm">{currentPost.author?.name}</p>
              <p className="text-xs text-slate-400">{format(new Date(currentPost.createdAt), 'MMM dd, yyyy')}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><FiEye size={14} /> {currentPost.viewCount}</span>
            <span className="flex items-center gap-1"><FiClock size={14} /> {readTime} min read</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${liked ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'}`}>
              <FiHeart /> {currentPost.likes?.length || 0}
            </button>
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-medium transition">
              <FiShare2 /> Share
            </button>
          </div>
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link to={`/edit-post/${id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition">
                <FiEdit2 /> Edit
              </Link>
              <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition">
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: currentPost.content }} />

        {/* Comments */}
        <div className="border-t border-slate-100 pt-8">
          <CommentSection postId={id} />
        </div>
      </div>
    </>
  );
}
