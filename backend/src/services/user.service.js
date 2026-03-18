const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Post = require("../models/post.model");

exports.register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw Object.assign(new Error("Email already registered"), { status: 400 });
  const hashed = await bcrypt.hash(password, 12);
  return User.create({ name, email, password: hashed });
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  return user;
};

exports.getById = async (id) => User.findById(id).select("-password");

exports.update = async (id, requesterId, data) => {
  if (id !== requesterId)
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

exports.getUserPosts = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = { author: userId, isPublished: true };
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(filter),
  ]);
  return { posts, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};
