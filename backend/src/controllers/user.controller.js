const userService = require("../services/user.service");
const generateToken = require("../utils/generateToken");
const uploadImage = require("../utils/uploadImage");

exports.register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ user, token: generateToken(user) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const user = await userService.login(req.body);
    res.json({ user, token: generateToken(user) });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updateData = { name: req.body.name, bio: req.body.bio };
    if (req.file) {
      updateData.profilePicture = await uploadImage(req.file, "blog/avatars");
    }
    const user = await userService.update(req.params.id, req.user.id, updateData);
    res.json(user);
  } catch (err) { next(err); }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await userService.getUserPosts(req.params.id, page, limit);
    res.json(data);
  } catch (err) { next(err); }
};
