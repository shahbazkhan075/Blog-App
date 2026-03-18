const commentService = require("../services/comment.service");

exports.getByPost = async (req, res, next) => {
  try {
    const comments = await commentService.getByPost(req.params.id);
    res.json(comments);
  } catch (err) { next(err); }
};

exports.add = async (req, res, next) => {
  try {
    const comment = await commentService.add(req.params.id, req.user.id, req.body.comment);
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await commentService.remove(req.params.id, req.user.id);
    res.json({ message: "Comment deleted" });
  } catch (err) { next(err); }
};
