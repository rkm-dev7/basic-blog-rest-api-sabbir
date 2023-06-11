const postController = require("../../controllers/authControllers/postController");
const { verifyToken } = require("../../middleware/auth");
const router = require("express").Router();

router.post("/posts", verifyToken, postController.createPost);
router.get("/posts", verifyToken, postController.getAllPosts);
router.get("/posts/:id", verifyToken, postController.getPost);
router.put("/posts/:id", verifyToken, postController.updatePost);
router.delete("/posts/:id", verifyToken, postController.deletePost);

module.exports = router;
