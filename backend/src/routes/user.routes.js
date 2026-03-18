const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/:id", ctrl.getProfile);
router.put("/:id", auth, upload.single("profilePicture"), ctrl.updateProfile);
router.get("/:id/posts", ctrl.getUserPosts);

module.exports = router;
