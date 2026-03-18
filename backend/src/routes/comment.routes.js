const router = require("express").Router();
const ctrl = require("../controllers/comment.controller");
const auth = require("../middleware/auth.middleware");

router.delete("/:id", auth, ctrl.remove);

module.exports = router;
