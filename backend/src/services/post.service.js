const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

const paginate = async (filter, page, limit, sort = { createdAt: -1 }) => {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate("author", "name profilePicture")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(filter),
  ]);
  return { posts, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

exports.getAll = (page, limit) => paginate({ isPublished: true }, page, limit);

exports.getById = async (id) => {
  const post = await Post.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate("author", "name profilePicture bio");
  if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });
  return post;
};

exports.create = async (data) => {
  const post = await Post.create(data);
  return Post.findById(post._id).populate("author", "name profilePicture");
};

exports.update = async (id, userId, data) => {
  const post = await Post.findById(id);
  if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });
  if (post.author.toString() !== userId)
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  return Post.findByIdAndUpdate(id, data, { new: true }).populate("author", "name profilePicture");
};

exports.remove = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });
  if (post.author.toString() !== userId)
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  await Post.findByIdAndDelete(id);
  await Comment.deleteMany({ postId: id });
};

exports.search = (q, page, limit) => {
  if (!q || !q.trim()) return paginate({ isPublished: true }, page, limit);
  return paginate(
    { title: { $regex: q.trim(), $options: "i" }, isPublished: true },
    page,
    limit
  );
};

exports.getByTag = (tag, page, limit) =>
  paginate({ tags: tag, isPublished: true }, page, limit);

exports.getByCategory = (category, page, limit) =>
  paginate({ category, isPublished: true }, page, limit);

exports.toggleLike = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });
  const idx = post.likes.indexOf(userId);
  if (idx === -1) post.likes.push(userId);
  else post.likes.splice(idx, 1);
  return post.save();
};

exports.getMyPosts = (userId, page, limit) =>
  paginate({ author: userId }, page, limit);
