const postService = require("../services/post.service");
const uploadImage = require("../utils/uploadImage");

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
};

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    res.json(await postService.getAll(page, limit));
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    res.json(await postService.getById(req.params.id));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, content, category, tags, isPublished } = req.body;
    let featuredImage = "";
    if (req.file) featuredImage = await uploadImage(req.file, "blog/posts");
    const post = await postService.create({
      title, content, category,
      tags: parseTags(tags),
      featuredImage,
      isPublished: isPublished === "false" ? false : true,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { title, content, category, tags, isPublished } = req.body;
    const updateData = { title, content, category, isPublished: isPublished === "false" ? false : true };
    if (tags !== undefined) updateData.tags = parseTags(tags);
    if (req.file) updateData.featuredImage = await uploadImage(req.file, "blog/posts");
    res.json(await postService.update(req.params.id, req.user.id, updateData));
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await postService.remove(req.params.id, req.user.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) { next(err); }
};

exports.search = async (req, res, next) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    res.json(await postService.search(q, page, limit));
  } catch (err) { next(err); }
};

exports.getByTag = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    res.json(await postService.getByTag(req.params.tag, page, limit));
  } catch (err) { next(err); }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    res.json(await postService.getByCategory(req.params.category, page, limit));
  } catch (err) { next(err); }
};

exports.toggleLike = async (req, res, next) => {
  try {
    res.json(await postService.toggleLike(req.params.id, req.user.id));
  } catch (err) { next(err); }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    res.json(await postService.getMyPosts(req.user.id, page, limit));
  } catch (err) { next(err); }
};

exports.getTrending = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    res.json(await postService.getTrending(limit));
  } catch (err) { next(err); }
};
