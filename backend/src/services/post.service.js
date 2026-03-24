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

  // Attach comment count to each post
  const postIds = posts.map((p) => p._id);
  const commentCounts = await Comment.aggregate([
    { $match: { postId: { $in: postIds } } },
    { $group: { _id: "$postId", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(commentCounts.map((c) => [c._id.toString(), c.count]));
  const postsWithCount = posts.map((p) => ({
    ...p.toObject(),
    commentCount: countMap[p._id.toString()] || 0,
  }));

  return { posts: postsWithCount, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
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

exports.getTrending = async (limit = 5) => {
  const posts = await Post.find({ isPublished: true })
    .populate("author", "name profilePicture")
    .sort({ viewCount: -1, likes: -1 })
    .limit(Number(limit))
    .lean();
  return posts;
};
