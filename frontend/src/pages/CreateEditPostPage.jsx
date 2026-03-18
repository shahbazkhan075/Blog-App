import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, fetchPostById, clearCurrentPost } from '../store/slices/postSlice';
import QuillEditor from '../components/common/QuillEditor';
import { Helmet } from 'react-helmet-async';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'];

export default function CreateEditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost } = useSelector((s) => s.posts);

  const [form, setForm] = useState({ title: '', content: '', category: 'Technology', tags: '', isPublished: true });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchPostById(id));
    return () => dispatch(clearCurrentPost());
  }, [id, dispatch]);

  useEffect(() => {
    if (id && currentPost) {
      setForm({
        title: currentPost.title || '',
        content: currentPost.content || '',
        category: currentPost.category || 'Technology',
        tags: currentPost.tags?.join(', ') || '',
        isPublished: currentPost.isPublished !== false,
      });
      if (currentPost.featuredImage) setPreview(currentPost.featuredImage);
    }
  }, [id, currentPost]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.content || form.content === '<p><br></p>') e.content = 'Content is required';
    return e;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('category', form.category);
    fd.append('tags', form.tags);
    fd.append('isPublished', form.isPublished);
    if (image) fd.append('featuredImage', image);

    try {
      if (id) {
        await dispatch(updatePost({ id, data: fd })).unwrap();
        toast.success('Post updated!');
      } else {
        await dispatch(createPost(fd)).unwrap();
        toast.success('Post published!');
      }
      navigate('/my-posts');
    } catch { toast.error('Failed to save post'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Helmet><title>{id ? 'Edit Post' : 'Create Post'} — BlogSpace</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">{id ? 'Edit Post' : 'Write New Post'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter a compelling title..."
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-400' : 'border-slate-200'}`} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category + Tags row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags <span className="font-normal text-slate-400">(comma separated)</span></label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="react, javascript, web"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Featured Image</label>
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="preview" className="h-48 rounded-xl object-cover" />
                <button type="button" onClick={() => { setImage(null); setPreview(''); }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-slate-600 hover:text-red-500">
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                <FiUpload className="text-slate-400 text-2xl mb-2" />
                <span className="text-sm text-slate-500">Click to upload image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content *</label>
            <div className={`rounded-xl overflow-hidden border ${errors.content ? 'border-red-400' : 'border-slate-200'}`}>
              <QuillEditor value={form.content} onChange={(v) => setForm({ ...form, content: v })} />
            </div>
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>

          {/* Publish toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`relative w-11 h-6 rounded-full transition ${form.isPublished ? 'bg-blue-600' : 'bg-slate-300'}`}
              onClick={() => setForm({ ...form, isPublished: !form.isPublished })}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">{form.isPublished ? 'Publish immediately' : 'Save as draft'}</span>
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {saving ? 'Saving...' : id ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
