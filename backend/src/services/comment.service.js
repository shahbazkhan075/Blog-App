const Comment = require("../models/comment.model");

exports.getByPost = (postId) =>
  Comment.find({ postId })
    .populate("userId", "name profilePicture")
    .sort({ createdAt: 1 });

exports.add = async (postId, userId, comment) => {
  const doc = await Comment.create({ postId, userId, comment });
  return Comment.findById(doc._id).populate("userId", "name profilePicture");
};

exports.remove = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw Object.assign(new Error("Comment not found"), { status: 404 });
  if (comment.userId.toString() !== userId)
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  await Comment.findByIdAndDelete(commentId);
};
