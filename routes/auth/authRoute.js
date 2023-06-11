const authControllers = require("../../controllers/authControllers/auth");

const { verifyToken } = require("../../middleware/auth");

const router = require("express").Router();

router.post("/signup", authControllers.signup);

router.post("/login", authControllers.login);

router.get("/users", verifyToken, authControllers.getAllUsers);

router.put("/users/:id", verifyToken, authControllers.updateUser);

router.delete("/users/:id", verifyToken, authControllers.deleteUser);

module.exports = router;
