import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateProfile } from '../../store/slices/userSlice';
import { fetchUserPosts } from '../../store/slices/postSlice';
import { updateUser } from '../../store/slices/authSlice';
import PostCard from '../../components/posts/PostCard';
import PostCardSkeleton from '../../components/skeletons/PostCardSkeleton';
import { Helmet } from 'react-helmet-async';
import { FiEdit2, FiCamera, FiCheck, FiX, FiCalendar, FiFileText, FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Avatar = ({ src, name }) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=3b82f6&color=fff&size=200`;
  return (
    <img
      src={src || fallback}
      alt={name}
      className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-lg"
      onError={(e) => { e.target.src = fallback; }}
    />
  );
};

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((s) => s.auth);
  const { profile, isLoading: profileLoading, error: profileError } = useSelector((s) => s.user);
  const { userPosts, isLoading: postsLoading } = useSelector((s) => s.posts);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwn = currentUser?._id === id;

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id));
      dispatch(fetchUserPosts({ userId: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (profile && profile._id === id) {
      setForm({ name: profile.name || '', bio: profile.bio || '' });
      setImgPreview(profile.profilePicture || '');
    }
  }, [profile, id]);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  }, []);

  const handleCancelEdit = () => {
    setEditing(false);
    setImgFile(null);
    setImgPreview(profile?.profilePicture || '');
    setForm({ name: profile?.name || '', bio: profile?.bio || '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('bio', form.bio.trim());
    if (imgFile) fd.append('profilePicture', imgFile);
    try {
      const updated = await dispatch(updateProfile({ id, data: fd })).unwrap();
      dispatch(updateUser(updated));
      setImgPreview(updated.profilePicture || '');
      setImgFile(null);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Loading skeleton
  if (profileLoading && !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-10">
          <div className="h-32 bg-slate-200" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-14 mb-5">
              <div className="w-28 h-28 rounded-full bg-slate-300 ring-4 ring-white" />
            </div>
            <div className="h-7 bg-slate-200 rounded w-48 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-72 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Error / not found
  if (profileError || (!profileLoading && !profile)) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">User not found</h2>
        <p className="text-slate-400 mb-6">This profile doesn't exist or was removed.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
          Go Home
        </Link>
      </div>
    );
  }

  const joinDate = profile.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : null;

  return (
    <>
      <Helmet><title>{profile.name} — BlogSpace</title></Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex items-end justify-between -mt-14 mb-5">
              <div className="relative">
                <Avatar src={imgPreview} name={profile.name} />
                {isOwn && editing && (
                  <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                    <FiCamera size={13} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  </label>
                )}
              </div>
              {isOwn && !editing && (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition">
                  <FiEdit2 size={14} /> Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name" maxLength={60} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3} maxLength={300}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell the world about yourself..." />
                  <p className="text-xs text-slate-400 mt-1 text-right">{form.bio.length}/300</p>
                </div>
                {imgFile && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    <FiCamera size={12} />
                    <span className="truncate">{imgFile.name}</span>
                    <button type="button" onClick={() => { setImgFile(null); setImgPreview(profile.profilePicture || ''); }}
                      className="ml-auto text-slate-400 hover:text-red-500 flex-shrink-0"><FiX size={12} /></button>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                    {saving
                      ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Saving...</>
                      : <><FiCheck size={14} /> Save Changes</>}
                  </button>
                  <button type="button" onClick={handleCancelEdit}
                    className="flex items-center gap-2 border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
                    <FiX size={14} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">{profile.name}</h1>
                {profile.bio
                  ? <p className="text-slate-500 text-sm leading-relaxed mb-3 max-w-xl">{profile.bio}</p>
                  : isOwn && <p className="text-slate-400 text-sm italic mb-3">Add a bio to tell people about yourself.</p>
                }
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  {joinDate && <span className="flex items-center gap-1.5"><FiCalendar size={12} /> Joined {joinDate}</span>}
                  <span className="flex items-center gap-1.5"><FiFileText size={12} /> {userPosts.length} post{userPosts.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {isOwn ? 'My Posts' : `Posts by ${profile.name}`}
          </h2>
          {isOwn && (
            <Link to="/create-post" className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
              <FiPlus size={14} /> New Post
            </Link>
          )}
        </div>

        {postsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((p) => <PostCard key={p._id} post={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="text-5xl mb-3">✍️</div>
            <p className="text-slate-500 font-medium mb-1">No posts yet</p>
            {isOwn && (
              <Link to="/create-post" className="text-blue-600 text-sm font-semibold hover:underline">
                Write your first post →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
