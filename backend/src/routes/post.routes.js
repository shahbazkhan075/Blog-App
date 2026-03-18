const router = require("express").Router();
const postCtrl = require("../controllers/post.controller");
const commentCtrl = require("../controllers/comment.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", postCtrl.getAll);
router.get("/my-posts", auth, postCtrl.getMyPosts);
router.get("/search", postCtrl.search);
router.get("/tag/:tag", postCtrl.getByTag);
router.get("/category/:category", postCtrl.getByCategory);
router.get("/:id", postCtrl.getById);
router.post("/", auth, upload.single("featuredImage"), postCtrl.create);
router.put("/:id", auth, upload.single("featuredImage"), postCtrl.update);
router.delete("/:id", auth, postCtrl.remove);
router.post("/:id/like", auth, postCtrl.toggleLike);

// Comments nested under posts
router.get("/:id/comments", commentCtrl.getByPost);
router.post("/:id/comments", auth, commentCtrl.add);

module.exports = router;
